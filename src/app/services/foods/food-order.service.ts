import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { CloudKitchen, FoodOrder, FoodOrderItem, OrderSearchQuery, OrderTracking, OrderUpdateRequest, PartyOrderItem } from 'src/app/model/all-foods';
import { Utils } from '../common/utils';
import { CloudKitchenService } from './cloudkitchen.service';
import { LocalService } from '../common/local.service';
import { ServiceLocator } from '../common/service.locator';
import { PaymentIntentRequest, PaymentIntentResponse } from 'src/app/model/common';
import { Constants } from '../common/constants';


@Injectable({
  providedIn: 'root',
})
export class FoodOrderService {
 
  servicePercentage: number = 7;
  ipAddress: any;
  cloudKitchen: CloudKitchen;
  foodOrderKey: string;
  private foodOrder?: FoodOrder;
  private partyOrder?: FoodOrder;
  public foodOrderSubject$ = new BehaviorSubject(this.foodOrder);
  public partyOrderSubject$ = new BehaviorSubject(this.foodOrder);
  public orderListSubject$ = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private cloudKitchenService: CloudKitchenService,
    private localService: LocalService,
    private serviceLocator: ServiceLocator
  ) {
    this.cloudKitchenService.cloudKitchenSubject$.subscribe((e) => {
      if (e !== undefined) {
        console.log('CloudKitchen object emitted a value ' + e._id);
        this.cloudKitchen = e;
        this.setupCloudKitchen();
      }
    });
  }


  updatePartyOrder(partyOrder: FoodOrder) {
    this.partyOrder = partyOrder;
    this.setData(partyOrder);
  }

  updateStatus(orderTracking: OrderTracking) {
    this.http
      .post<OrderTracking>(
        this.serviceLocator.FoodOrdersTrackingUrl,
        orderTracking
      )
      .subscribe((e) => {
        console.log('Update status response. ' + JSON.stringify(e));
      });
  }

  action(reference: string, action: string): Observable<FoodOrder> {
    const params = new HttpParams({
      fromString: 'ref=' + reference + '&action=' + action,
    });
    // const options = params ? { params: params } : {};
    var url = this.serviceLocator.FoodOrdersUrl + '/action';
    console.log('Action on order ' + url + '. Params: ' + params);
    return this.http.put<FoodOrder>(url, params).pipe(
      tap((result) => {
        // this.setData(result);
      })
    );
  }

  saveOrder(order: FoodOrder): Observable<FoodOrder> {
    this.foodOrder = order;
    this.calculateFoodOrderTotal();
    var params = new HttpParams();
    params = params.set('action', 'IntentToPay');
    return this.http
      .post<FoodOrder>(this.serviceLocator.FoodOrdersUrl, this.foodOrder, { params })
      .pipe(
        tap((result) => {
          this.setData(result);
        })
      );
  }

  setupCloudKitchen() {
    if (this.cloudKitchen) {
      console.log('Current cloudKitchen ' + this.cloudKitchen._id);
      if (this.foodOrder  ) {
        if (this.foodOrder.status === 'Completed'  ) {
          return;
        }
        if (this.foodOrder.total === 0 && (!this.foodOrder.cloudKitchen || this.foodOrder.cloudKitchen._id !== this.cloudKitchen._id) ){
          this.setCloudKitchenInFoodOrder();
          console.log('Updated cloudKitchen in the food order');
          this.setData(this.foodOrder);
          return;
        }
        if (this.foodOrder.cloudKitchen._id === this.cloudKitchen._id){
          console.log('The food order has current cloudKitchen')
          return;
        }
        if (this.foodOrder.total > 0 && (this.foodOrder.cloudKitchen._id !== this.cloudKitchen._id) ){
          console.log('You have changed the cloudKitchen. Flushing the existing food order')
          this.createFoodOrder();
          return;
        }
      }
      if (this.partyOrder  ) {
        if (this.partyOrder.status === 'Completed'  ) {
          return;
        }
        if (this.partyOrder.total === 0 && (!this.partyOrder.cloudKitchen || this.partyOrder.cloudKitchen._id !== this.cloudKitchen._id) ){
          this.setCloudKitchenInPartyOrder();
          console.log('Updated cloudKitchen in the party order');
          this.setData(this.partyOrder);
          return;
        }
        if (this.partyOrder.cloudKitchen._id === this.cloudKitchen._id){
          console.log('The party order has current cloudKitchen')
          return;
        }
        if (this.partyOrder.total > 0 && (this.partyOrder.cloudKitchen._id !== this.cloudKitchen._id) ){
          console.log('You have changed the cloudKitchen. Flushing the existing party order')
          this.createPartyOrder();
          return;
        }
      }

    } 
  }


  retrieveSingleOrder(
    reference: string,
    intent: string
  ): Observable<FoodOrder[]> {
    var params = new HttpParams();
    if (reference !== null && reference !== undefined) {
      params = params.set('ref', reference);
    }
    if (intent !== null && intent !== undefined) {
      params = params.set('intent', intent);
    }
    var url = this.serviceLocator.FoodOrdersUrl;
    console.log('Fetching food orders ' + url);
    return this.http.get<FoodOrder[]>(url, { params: params });
  }

  retrieveFoodOrders(email: string): Observable<FoodOrder[]> {
    var params = new HttpParams();
    if (email !== null && email !== undefined) {
      params = params.set('customer', email);
    }
    var url = this.serviceLocator.FoodOrdersUrl;
    console.log('Fetching food orders ' + url);
    return this.http.get<FoodOrder[]>(url, { params: params }).pipe(
      tap((data) => {
        this.setFoodOrders(data);
      })
    );
  }

  retrieveSinglePaymentIntent(
    intentId: string
  ): Observable<PaymentIntentResponse> {
    return this.http.get<PaymentIntentResponse>(
      this.serviceLocator.FoodOrdersPaymentIntentUrl + '/' + intentId
    );
  }

  fetchPaymentIntent(
    ref: string,
    intent: string
  ): Observable<PaymentIntentResponse[]> {
    var params = new HttpParams();
    if (ref !== null && ref !== undefined) {
      params = params.set('ref', ref);
    }
    if (intent !== null && intent !== undefined) {
      params = params.set('intent', intent);
    }

    console.log('Fetching payment intent for '+ ref+' from url '+ this.serviceLocator.FoodOrdersPaymentIntentUrl);
    return this.http.get<PaymentIntentResponse[]>(
      this.serviceLocator.FoodOrdersPaymentIntentUrl,
      { params: params }
    );
  }

  updateSinglePaymentIntent(
    intentId: string,
    status: string
  ): Observable<PaymentIntentResponse> {
    var params = new HttpParams();
    if (status !== null && status !== undefined) {
      params = params.set('status', status);
    }
    var url = this.serviceLocator.FoodOrdersPaymentIntentUrl + '/' + intentId;
    console.log('Updating payment intent ' + url);
    return this.http.put<PaymentIntentResponse>(url, { params });
  }

  retrievePaymentIntent(orderId: string): Observable<PaymentIntentResponse> {
    var params = new HttpParams();
    if (orderId !== null && orderId !== undefined) {
      params = params.set('orderId', orderId);
    }
    return this.http.get<PaymentIntentResponse>(
      this.serviceLocator.FoodOrdersPaymentIntentUrl,
      { params }
    );
  }

  getCloudKitchenOrders(
    orderSearchQuery: OrderSearchQuery
  ): Observable<FoodOrder[]> {
    var params = new HttpParams();
    if (
      orderSearchQuery.reference !== null &&
      orderSearchQuery.reference !== undefined
    ) {
      params = params.set('reference', orderSearchQuery.reference);
    }
    if (
      orderSearchQuery.customerEmail !== null &&
      orderSearchQuery.customerEmail !== undefined
    ) {
      params = params.set('customerEmail', orderSearchQuery.customerEmail);
    }
    if (
      orderSearchQuery.cloudKitchenId !== null &&
      orderSearchQuery.cloudKitchenId !== undefined
    ) {
      params = params.set('cloudKitchenId', orderSearchQuery.cloudKitchenId);
    }
    if (
      orderSearchQuery.orderId !== null &&
      orderSearchQuery.orderId !== undefined
    ) {
      params = params.set('orderId', orderSearchQuery.orderId);
    }
    if (orderSearchQuery.thisMonth) {
      params = params.set('thisMonth', 'true');
    }
    if (orderSearchQuery.thisYear) {
      params = params.set('thisYear', 'true');
    }
    if (orderSearchQuery.all) {
      params = params.set('all', 'true');
    }
    return this.http.get<FoodOrder[]>(
      this.serviceLocator.FoodOrderSearchUrl,
      { params }
    );
  }

  getOrders(orderSearchQuery: OrderSearchQuery): Observable<FoodOrder[]> {
    var params = new HttpParams();
    if (
      orderSearchQuery.reference !== null &&
      orderSearchQuery.reference !== undefined
    ) {
      params = params.set('reference', orderSearchQuery.reference);
    }
    if (
      orderSearchQuery.customerEmail !== null &&
      orderSearchQuery.customerEmail !== undefined
    ) {
      params = params.set('customerEmail', orderSearchQuery.customerEmail);
    }
    if (
      orderSearchQuery.cloudKitchenId !== null &&
      orderSearchQuery.cloudKitchenId !== undefined
    ) {
      params = params.set('cloudKitchenId', orderSearchQuery.cloudKitchenId);
    }
    if (
      orderSearchQuery.orderId !== null &&
      orderSearchQuery.orderId !== undefined
    ) {
      params = params.set('orderId', orderSearchQuery.orderId);
    }
    if (orderSearchQuery.thisMonth) {
      params = params.set('thisMonth', 'true');
    }
    if (orderSearchQuery.thisYear) {
      params = params.set('thisYear', 'true');
    }
    if (orderSearchQuery.all) {
      params = params.set('all', 'true');
    }
    return this.http.get<FoodOrder[]>(this.serviceLocator.FoodOrderSearchUrl, {
      params,
    });
  }

  getFoodOrders(orderSearchQuery: OrderSearchQuery): Observable<FoodOrder[]> {
    console.log(
      'Retrieving food orders for ' + JSON.stringify(orderSearchQuery)
    );
    var params = new HttpParams();
    if (
      orderSearchQuery.reference !== null &&
      orderSearchQuery.reference !== undefined
    ) {
      params = params.set('reference', orderSearchQuery.reference);
    }
    if (
      orderSearchQuery.customerEmail !== null &&
      orderSearchQuery.customerEmail !== undefined
    ) {
      params = params.set('customer', orderSearchQuery.customerEmail);
    }
    if (
      orderSearchQuery.cloudKitchenId !== null &&
      orderSearchQuery.cloudKitchenId !== undefined
    ) {
      params = params.set('cloudKitchenId', orderSearchQuery.cloudKitchenId);
    }
    if (orderSearchQuery.thisMonth) {
      params = params.set('thisMonth', 'true');
    }
    if (orderSearchQuery.thisYear) {
      params = params.set('thisYear', 'true');
    }
    if (orderSearchQuery.all) {
      params = params.set('all', 'true');
    }
    return this.http.get<FoodOrder[]>(this.serviceLocator.FoodOrdersUrl, {
      params,
    });
  }

  private getIPAddress() {
    this.http.get('http://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  public addToOrder(foodOrderItem: FoodOrderItem) {
    console.log('Adding item to food order ' + foodOrderItem.name);
    if (!this.foodOrder) {
      this.buildFoodOrderFromCache(true);
    }
    if (this.foodOrder &&this.foodOrder.items === null) {
      this.foodOrder.items = [];
    }

    this.foodOrder.items.push(foodOrderItem);
    this.calculateFoodOrderTotal();
  }

  addPartyItemToOrder(partyItem: PartyOrderItem) {
    console.log('Adding party item to party order ' + partyItem.name);
    if (!this.partyOrder) {
      this.buildPartyOrderFromCache(true);
    }
    if (this.partyOrder && this.partyOrder.partyItems.length === 0 ) {
      this.partyOrder.partyItems = [];
    }

    this.partyOrder.partyItems.push(partyItem);
    this.calculatePartyOrderTotal();
  }

  removePartyItem(partyItem: PartyOrderItem) {
    if (this.partyOrder) {
      for (var i = 0; i < this.partyOrder.partyItems.length; i++) {
        var item = this.partyOrder.partyItems[i];
        if (item._tempId === partyItem._tempId) {
          this.partyOrder.partyItems.splice(i, 1);
        }
      }
    }
    this.calculatePartyOrderTotal();
  }

  removeItem(itemToDelete: FoodOrderItem) {
    if (this.foodOrder) {
      for (var i = 0; i < this.foodOrder.items.length; i++) {
        var item = this.foodOrder.items[i];
        if (item._tempId === itemToDelete._tempId) {
          this.foodOrder.items.splice(i, 1);
        }
      }
    }
    this.calculateFoodOrderTotal();
  }

  updateItem(item: FoodOrderItem) {
    var idx = -1;
    console.log('Updating item ' + JSON.stringify(item));
    if (this.foodOrder) {
      for (var i = 0; i < this.foodOrder.items.length; i++) {
        var fi = this.foodOrder.items[i];
        if (fi._tempId === item._tempId) {
          idx = i;
          break;
        }
      }

      if (idx != -1) {
        const newItems = [
          ...this.foodOrder.items.slice(0, idx),
          item,
          ...this.foodOrder.items.slice(idx + 1),
        ];
        this.foodOrder.items = newItems;
        this.calculateFoodOrderTotal();
      }
    }
  }

  updatePartyItem(partyItem: PartyOrderItem) {
    var idx = -1;
    console.log('Updating party item ' + JSON.stringify(partyItem));
    if (this.partyOrder ) {
      for (var i = 0; i < this.partyOrder.partyItems.length; i++) {
        var fi = this.partyOrder.partyItems[i];
        if (fi._tempId === partyItem._tempId) {
          console.log('Found existing party item at index ' + i);
          idx = i;
          break;
        }
      }

      if (idx != -1) {
        const newItems = [
          ...this.partyOrder.partyItems.slice(0, idx),
          partyItem,
          ...this.partyOrder.partyItems.slice(idx + 1),
        ];
        this.partyOrder.partyItems = newItems;
        this.calculatePartyOrderTotal();
      }
    }
  }

  public calculateFoodOrderTotal() {
    var subTotal: number = 0.0;
    
    if (this.foodOrder && !this.foodOrder.partyOrder && this.foodOrder.items) {
      this.foodOrder.items.forEach((item) => {
        subTotal = subTotal + item.subTotal;
      });
    }

    this.foodOrder.deliveryFee = 0.0;
    this.foodOrder.packingFee = 0.0;
    this.foodOrder.serviceFee = 0.0;
    this.foodOrder.subTotal = subTotal;
    if (subTotal !== 0) {
      // this.foodOrder.serviceFee = 1.0;
      if (this.foodOrder.serviceMode === 'DELIVERY') {
        if ( this.cloudKitchen && this.cloudKitchen.freeDeliveryOver && this.cloudKitchen.freeDeliveryOver > subTotal){
          this.foodOrder.deliveryFee = this.cloudKitchen.deliveryFee? this.cloudKitchen.deliveryFee : 0.00;
        }
        if ( this.cloudKitchen.packagingFee){
          this.foodOrder.packingFee = this.cloudKitchen.packagingFee;
        }
      }
      var serviceFee = (7 / 100) * subTotal;
      this.foodOrder.serviceFee = serviceFee;
    }

    var totalToPay: number =
      this.foodOrder.subTotal +
      this.foodOrder.deliveryFee +
      this.foodOrder.packingFee +
      this.foodOrder.serviceFee;

    this.foodOrder.total = totalToPay;
    if (! this.foodOrder.total){
      this.foodOrder.total = 0;
    }
    this.foodOrder.total = +(+this.foodOrder.total).toFixed(2);
    console.log('Food order updated with SubTotal: ' + subTotal + ' Total: ' + totalToPay);
    this.setData(this.foodOrder);
  }

  public calculatePartyOrderTotal() {
    var subTotal: number = 0.0;
    if (this.partyOrder && this.partyOrder.partyOrder && this.partyOrder.partyItems) {
      this.partyOrder.partyItems.forEach((item) => {
        subTotal = subTotal + item.subTotal;
      });
    }
    
    this.partyOrder.deliveryFee = 0.0;
    this.partyOrder.packingFee = 0.0;
    this.partyOrder.serviceFee = 0.0;
    this.partyOrder.subTotal = subTotal;
    if (subTotal !== 0) {
      this.partyOrder.serviceFee = 0.5;
      if (this.partyOrder.serviceMode === 'DELIVERY') {
        this.partyOrder.deliveryFee = 0.5;
      }
    }

    var totalToPay: number =
      this.partyOrder.subTotal +
      this.partyOrder.deliveryFee +
      this.partyOrder.packingFee +
      this.partyOrder.serviceFee;

    this.partyOrder.total = totalToPay;
    this.partyOrder.total = +(+this.partyOrder.total).toFixed(2);
    console.log('Party order updated with Subtotal: ' + subTotal + ' Total: ' + totalToPay);
    this.setData(this.partyOrder);
  }
  createPaymentIntentForOrder(
    FoodOrder: FoodOrder
  ): Observable<PaymentIntentResponse> {
    console.log('Creating intent for order: ' + JSON.stringify(FoodOrder));
    const paymentIntentRequest: PaymentIntentRequest = {
      currency: 'GBP',
      amount: FoodOrder.total,
      orderReference: FoodOrder.reference,
      customerEmail: FoodOrder.customer.email,
    };
    console.log(
      'Creating payment intent: ' +
      this.serviceLocator.FoodOrdersPaymentIntentUrl +
      ', ' +
      JSON.stringify(paymentIntentRequest)
    );
    return this.http.post<PaymentIntentResponse>(
      this.serviceLocator.FoodOrdersPaymentIntentUrl,
      paymentIntentRequest
    );
  }

  createPaymentIntent(
    paymentIntentRequest: PaymentIntentRequest
  ): Observable<PaymentIntentResponse> {
    console.log(
      'Creating payment intent: ' +
      this.serviceLocator.FoodOrdersPaymentIntentUrl +
      ', ' +
      JSON.stringify(paymentIntentRequest)
    );
    return this.http.post<PaymentIntentResponse>(
      this.serviceLocator.FoodOrdersPaymentIntentUrl,
      paymentIntentRequest
    );
  }

  public createOrder(partyOrder: boolean) {
    console.log('Creating empty new order');
    if (Utils.isValid(this.cloudKitchen)) {
      this.cloudKitchen = this.cloudKitchenService.getData();
    }
    if (partyOrder) {
      this.createPartyOrder();
    } else {
      this.createFoodOrder();
    }
  }

  private createPartyOrder() {
    this.partyOrder = {
      id: '',
      paymentIntentId: '',
      clientSecret: '',
      cloudKitchen: {
        _id: this.cloudKitchen?._id,
        name: this.cloudKitchen?.name,
        image: this.cloudKitchen?.image,
        mobile: this.cloudKitchen?.contact.mobile,
        email: this.cloudKitchen?.contact.email,
        address: {
          addressLine1: this.cloudKitchen?.address.addressLine1,
          addressLine2: this.cloudKitchen?.address.addressLine2,
          city: this.cloudKitchen?.address.city,
          country: this.cloudKitchen?.address.country,
          postcode: this.cloudKitchen?.address.postcode,
          latitude: this.cloudKitchen?.address.latitude,
          longitude: this.cloudKitchen?.address.longitude,
        },
      },
      customer: {
        _id: '',
        name: '',
        mobile: '',
        email: '',
        address: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          country: '',
          postcode: '',
          latitude: '',
          longitude: '',
        },
      },
      reference: '',
      currency: 'GBP',
      serviceMode: '',
      items: [],
      partyItems: [],
      subTotal: 0,
      total: 0,
      serviceFee: 0,
      deliveryFee: this.getDeliveryFee(),
      packingFee: this.getPackagingFee(),
      dateCreated: new Date(),
      partyDate: undefined,
      deliverBy: undefined,
      collectBy: undefined,
      dateDeleted: undefined,
      expectedDeliveryDate: undefined,
      dateAccepted: undefined,
      dateDelivered: undefined,
      dateCollected: undefined,
      partyOrder: true,
      notes: '',
    };
    console.log('Created a new party Order ');
    this.setData(this.partyOrder);
  }

  private createFoodOrder() {
    this.foodOrder = {
      id: '',
      paymentIntentId: '',
      clientSecret: '',
      cloudKitchen: {
        _id: this.cloudKitchen?._id,
        name: this.cloudKitchen?.name,
        image: this.cloudKitchen?.image,
        mobile: this.cloudKitchen?.contact.mobile,
        email: this.cloudKitchen?.contact.email,
        address: {
          addressLine1: this.cloudKitchen?.address.addressLine1,
          addressLine2: this.cloudKitchen?.address.addressLine2,
          city: this.cloudKitchen?.address.city,
          country: this.cloudKitchen?.address.country,
          postcode: this.cloudKitchen?.address.postcode,
          latitude: this.cloudKitchen?.address.latitude,
          longitude: this.cloudKitchen?.address.longitude,
        },
      },
      customer: {
        _id: '',
        name: '',
        mobile: '',
        email: '',
        address: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          country: '',
          postcode: '',
          latitude: '',
          longitude: '',
        },
      },
      reference: '',
      currency: 'GBP',
      serviceMode: '',
      items: [],
      partyItems: [],
      subTotal: 0,
      total: 0,
      serviceFee: 0,
      deliveryFee: this.getDeliveryFee(),
      packingFee: this.getPackagingFee(),
      dateCreated: new Date(),
      partyDate: undefined,
      deliverBy: undefined,
      collectBy: undefined,
      dateDeleted: undefined,
      expectedDeliveryDate: undefined,
      dateAccepted: undefined,
      dateDelivered: undefined,
      dateCollected: undefined,
      partyOrder: false,
      notes: '',
    };
    console.log('Created a new food Order ');
    this.setData(this.foodOrder);
  }

  getDeliveryFee(): number {
    var deliveryFee = 0.0;
    if (this.cloudKitchen !== null && this.cloudKitchen !== undefined) {
      this.cloudKitchen.deliveryFee;
    }
    return deliveryFee;
  }

  getPackagingFee(): number {
    var packagingFee = 0.0;
    if (this.cloudKitchen !== null && this.cloudKitchen !== undefined) {
      this.cloudKitchen.packagingFee;
    }
    return packagingFee;
  }

  updateOrder(orderUpdateRequest: OrderUpdateRequest): Observable<FoodOrder> {
    console.log(
      'Updating Order: ' +
      this.serviceLocator.FoodOrdersUrl +
      ', ' +
      JSON.stringify(orderUpdateRequest)
    );
    return this.http
      .put<FoodOrder>(this.serviceLocator.FoodOrdersUrl, orderUpdateRequest)
      .pipe(
        tap((result) => {
          console.log('Order update response ' + JSON.stringify(result));
        })
      );
  }

  placeOrder(FoodOrder: FoodOrder): Observable<FoodOrder> {
    console.log(
      'Placing an order for LocalChef : ' +
      this.serviceLocator.FoodOrdersUrl +
      ', ' +
      JSON.stringify(FoodOrder)
    );
    return this.http.post<FoodOrder>(
      this.serviceLocator.FoodOrdersUrl,
      FoodOrder
    );
    // .subscribe({
    //   next: data => {
    //     var response = JSON.stringify(data);
    //     this.foodOrder = data;
    //     console.log('FoodOrder created: ' + response);
    //   },
    //   error: e => { console.error('Error when creating order ' + e) }
    // });
  }

  setData(order: FoodOrder) {

    if (order.partyOrder) {
      console.log('Storing party order in cache  and notifying.. ')
      this.localService.saveData(Constants.StorageItem_Party_Order, JSON.stringify(order));
      this.partyOrderSubject$.next(this.partyOrder);
    } else {
      console.log('Storing food order in cache and notifying.. ')
      this.localService.saveData(Constants.StorageItem_Food_Order, JSON.stringify(order));
      this.foodOrderSubject$.next(this.foodOrder);
    }
  }

  setFoodOrders(FoodOrders: FoodOrder[]) {
    console.info('Storing food orders..');
    this.localService.saveData(
      Constants.StorageItem_F_OrderList,
      JSON.stringify(FoodOrders)
    );
    this.orderListSubject$.next(FoodOrders);
  }

  purgeData() {
    console.log('Purging all food orders.');
    this.localService.removeData(Constants.StorageItem_Food_Order);
    this.localService.removeData(Constants.StorageItem_Party_Order);
    this.foodOrder = null;
    this.partyOrder = null;
    this.foodOrderSubject$.next(null);
    this.partyOrderSubject$.next(null);
  }

  getData() {
    this.buildFoodOrderFromCache(false);
    this.buildPartyOrderFromCache(false);
  }

  private buildFoodOrderFromCache(createNew: boolean) {
    var json = this.localService.getData(Constants.StorageItem_Food_Order);
    if (Utils.isValid(json) && Utils.isJsonString(json)) {
      var obj = JSON.parse(json);
      this.foodOrder = obj.constructor.name === 'Array' ? obj[0] : obj;
      console.log('FoodOrder found in cache' + JSON.stringify(this.foodOrder));
      this.foodOrderSubject$.next(this.foodOrder);
    } else {
      console.log('FoodOrder not found in Cache');
      if ( createNew){
        this.createFoodOrder();
      }
    }
  }

  private buildPartyOrderFromCache(createNew: boolean) {
    var json = this.localService.getData(Constants.StorageItem_Party_Order);
    if (Utils.isValid(json) && Utils.isJsonString(json)) {
      var obj = JSON.parse(json);
      this.partyOrder = obj.constructor.name === 'Array' ? obj[0] : obj;
      console.log('PartyOrder found in Cache' + JSON.stringify(this.partyOrder));
      this.partyOrderSubject$.next(this.partyOrder);
    } else {
      console.log('PartyOrder not found in Cache');
      if ( createNew){
        this.createPartyOrder();
      }
    }
  }

  destroy() {
    this.purgeData();
  }

  destroyFoodOrder() {
    console.log('Destroying food order')
    this.localService.removeData(Constants.StorageItem_Food_Order);
    this.foodOrder = null;
    this.foodOrderSubject$.next(null);
  }
  destroyPartyOrder() {
    console.log('Destroying party order')
    this.localService.removeData(Constants.StorageItem_Party_Order);
    this.partyOrder = null;
    this.partyOrderSubject$.next(null);
  }

  setCloudKitchenInFoodOrder() {
    this.foodOrder.cloudKitchen = {
      _id: this.cloudKitchen?._id,
      name: this.cloudKitchen?.name,
      image: this.cloudKitchen?.image,
      mobile: this.cloudKitchen?.contact.mobile,
      email: this.cloudKitchen?.contact.email,
      address: {
        addressLine1: this.cloudKitchen?.address.addressLine1,
        addressLine2: this.cloudKitchen?.address.addressLine2,
        city: this.cloudKitchen?.address.city,
        country: this.cloudKitchen?.address.country,
        postcode: this.cloudKitchen?.address.postcode,
        latitude: this.cloudKitchen?.address.latitude,
        longitude: this.cloudKitchen?.address.longitude,
      }
    }
  }
  setCloudKitchenInPartyOrder() {
    this.foodOrder.cloudKitchen = {
      _id: this.cloudKitchen?._id,
      name: this.cloudKitchen?.name,
      image: this.cloudKitchen?.image,
      mobile: this.cloudKitchen?.contact.mobile,
      email: this.cloudKitchen?.contact.email,
      address: {
        addressLine1: this.cloudKitchen?.address.addressLine1,
        addressLine2: this.cloudKitchen?.address.addressLine2,
        city: this.cloudKitchen?.address.city,
        country: this.cloudKitchen?.address.country,
        postcode: this.cloudKitchen?.address.postcode,
        latitude: this.cloudKitchen?.address.latitude,
        longitude: this.cloudKitchen?.address.longitude,
      }
    }
  }

}


