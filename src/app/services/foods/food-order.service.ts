import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable, BehaviorSubject, of } from 'rxjs';
import { FoodOrder, FoodOrderItem, LocalChef, OrderSearchQuery, OrderTracking, OrderUpdateRequest, Orders, PartyOrderItem, SupplierOrders } from 'src/app/model/all-foods';
import { Utils } from '../common/utils';
import { ChefService } from './chef.service';
import { LocalService } from '../common/local.service';
import { ServiceLocator } from '../common/service.locator';
import { PaymentIntentRequest, PaymentIntentResponse } from 'src/app/model/common';
import { Constants } from '../common/constants';


@Injectable({
  providedIn: 'root',
})
export class FoodOrderService {
  ipAddress: any;
  supplier: LocalChef;
  foodOrderKey: string;
  private foodOrder?: FoodOrder;
  public orderSubject$ = new BehaviorSubject(this.foodOrder);
  public orderListSubject$ = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private chefService: ChefService,
    private localService: LocalService,
    private serviceLocator: ServiceLocator
  ) {
    this.chefService.chefSubject$.subscribe((e) => {
      if (e !== undefined) {
        console.log('Supplier object emitted a value ' + e._id);
        this.supplier = e;
        this.setupSupplier();
      }
    });
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
    // var params = new HttpParams();
    // if (reference !== null && reference !== undefined) {
    //   params = params.set('ref', reference);
    // }
    // if (action !== null && action !== undefined) {
    //   params = params.set('action', action);
    // }
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
    var params = new HttpParams();
    params = params.set('action', 'IntentToPay');
    return this.http
      .post<FoodOrder>(this.serviceLocator.FoodOrdersUrl, order, { params })
      .pipe(
        tap((result) => {
          this.setData(result);
        })
      );
  }

  setupSupplier() {
    if (this.supplier !== null && this.supplier !== undefined) {
      console.log('Current supplier ' + this.supplier._id);
      if (this.foodOrder !== null && this.foodOrder !== undefined) {
        if (this.foodOrder.status === 'Completed') {
          return;
        }
        if (
          this.foodOrder.supplier === null ||
          this.foodOrder.supplier._id === undefined ||
          this.foodOrder.supplier._id !== this.supplier._id
        ) {
          console.log('Setting up supplier');
          this.changeSupplier();
          this.foodOrder.items = [];
          this.foodOrder.status = 'Draft';
          this.calculateTotal();
        }
      }
    } else {
      console.log(
        'Supplier not found in context. Cannot set supplier into order..'
      );
    }
  }

  private changeSupplier() {
    this.foodOrder.supplier = {
      _id: this.supplier._id,
      name: this.supplier.name,
      image: this.supplier.coverPhoto,
      mobile: this.supplier.contact.mobile,
      email: this.supplier.contact.email,
      address: this.supplier.address,
    };
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

  getSupplierOrders(
    orderSearchQuery: OrderSearchQuery
  ): Observable<SupplierOrders> {
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
      orderSearchQuery.chefId !== null &&
      orderSearchQuery.chefId !== undefined
    ) {
      params = params.set('chefId', orderSearchQuery.chefId);
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
    return this.http.get<SupplierOrders>(
      this.serviceLocator.FoodOrderSearchUrl,
      { params }
    );
  }

  getOrders(orderSearchQuery: OrderSearchQuery): Observable<Orders> {
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
      orderSearchQuery.chefId !== null &&
      orderSearchQuery.chefId !== undefined
    ) {
      params = params.set('chefId', orderSearchQuery.chefId);
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
    return this.http.get<Orders>(this.serviceLocator.FoodOrderSearchUrl, {
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
      orderSearchQuery.chefId !== null &&
      orderSearchQuery.chefId !== undefined
    ) {
      params = params.set('chefId', orderSearchQuery.chefId);
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
    console.log('Adding item to food order '+ foodOrderItem.name);
    if (this.foodOrder === null || this.foodOrder === undefined) {
      this.getData();
    }
    if (
      this.foodOrder != null &&
      this.foodOrder !== undefined &&
      this.foodOrder.items === null
    ) {
      this.foodOrder.items = [];
    }

    this.foodOrder.items.push(foodOrderItem);
    this.calculateTotal();
  }

  addPartyItemToOrder(partyItem: PartyOrderItem) {
    console.log('Adding party item to food order '+ partyItem.name);
    if (this.foodOrder === null || this.foodOrder === undefined) {
      this.getData();
    }
    if (
      this.foodOrder != null &&
      this.foodOrder !== undefined &&
      this.foodOrder.partyItems === null
    ) {
      this.foodOrder.partyItems = [];
    }

    this.foodOrder.partyItems.push(partyItem);
    this.calculateTotal();
  }

  removePartyItem(partyItem: PartyOrderItem) {
    if (this.foodOrder) {
      for (var i = 0; i < this.foodOrder.partyItems.length; i++) {
        var item = this.foodOrder.partyItems[i];
        if (item._tempId === partyItem._tempId) {
          this.foodOrder.partyItems.splice(i, 1);
        }
      }
    }
    this.calculateTotal();
  }

  removeItem(itemToDelete: FoodOrderItem) {
    if (this.foodOrder !== null && this.foodOrder !== undefined) {
      for (var i = 0; i < this.foodOrder.items.length; i++) {
        var item = this.foodOrder.items[i];
        if (item._tempId === itemToDelete._tempId) {
          this.foodOrder.items.splice(i, 1);
        }
      }
    }
    this.calculateTotal();
  }

  updateItem(item: FoodOrderItem) {
    var idx = -1;
    console.log('Updating item ' + JSON.stringify(item));
    if (this.foodOrder !== null && this.foodOrder !== undefined) {
      for (var i = 0; i < this.foodOrder.items.length; i++) {
        var fi = this.foodOrder.items[i];
        if (fi._tempId === item._tempId) {
          console.log('Found existing item at index ' + i);
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
        // this.foodOrder.items.splice(i, 1);
        // this.foodOrder.items.push(item);
        this.calculateTotal();
      }
    }
  }

  updatePartyItem(partyItem: PartyOrderItem) {
    var idx = -1;
    console.log('Updating party item ' + JSON.stringify(partyItem));
    if (this.foodOrder !== null && this.foodOrder !== undefined) {
      for (var i = 0; i < this.foodOrder.partyItems.length; i++) {
        var fi = this.foodOrder.partyItems[i];
        if (fi._tempId === partyItem._tempId) {
          console.log('Found existing party item at index ' + i);
          idx = i;
          break;
        }
      }

      if (idx != -1) {
        const newItems = [
          ...this.foodOrder.partyItems.slice(0, idx),
          partyItem,
          ...this.foodOrder.partyItems.slice(idx + 1),
        ];
        this.foodOrder.partyItems = newItems;
        this.calculateTotal();
      }
    }
  }
  public calculateTotal() {
    var subTotal: number = 0.0;
    if ( this.foodOrder.partyOrder && this.foodOrder.partyItems){
      this.foodOrder.partyItems.forEach((item) => {
        subTotal = subTotal + item.subTotal;
      });
    }
    if ( !this.foodOrder.partyOrder && this.foodOrder.items){
      this.foodOrder.items.forEach((item) => {
        subTotal = subTotal + item.subTotal;
      });
    }
    
    this.foodOrder.deliveryFee = 0.0;
    this.foodOrder.packingFee = 0.0;
    this.foodOrder.serviceFee = 0.0;
    this.foodOrder.subTotal = subTotal;
    if (subTotal !== 0) {
      this.foodOrder.serviceFee = 0.5;
      if (this.foodOrder.serviceMode === 'DELIVERY') {
        this.foodOrder.deliveryFee = 0.5;
      }
    }

    var totalToPay: number =
      this.foodOrder.subTotal +
      this.foodOrder.deliveryFee +
      this.foodOrder.packingFee +
      this.foodOrder.serviceFee;
    
    this.foodOrder.total = totalToPay;
    this.foodOrder.total = +(+this.foodOrder.total).toFixed(2);
    console.log('Food order SubTotal: ' + subTotal+' Total: '+ totalToPay);
    this.setData(this.foodOrder);
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

  public createOrder() {
    console.log('Creating empty new order');
    if (Utils.isValid(this.supplier)) {
      this.supplier = this.chefService.getData();
    }
    this.foodOrder = {
      id: '',
      paymentIntentId: '',
      clientSecret: '',
      supplier: {
        _id: this.supplier?._id,
        name: this.supplier?.kitchenName,
        image: this.supplier?.coverPhoto,
        mobile: this.supplier?.contact.mobile,
        email: this.supplier?.contact.email,
        address: {
          addressLine1: this.supplier?.address.addressLine1,
          addressLine2: this.supplier?.address.addressLine2,
          city: this.supplier?.address.city,
          country: this.supplier?.address.country,
          postcode: this.supplier?.address.postcode,
          latitude: this.supplier?.address.latitude,
          longitude: this.supplier?.address.longitude,
        },
      },
      customer: {
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

    console.log('Created a empty Order ' + JSON.stringify(this.foodOrder));
  }

  getDeliveryFee(): number {
    var deliveryFee = 0.0;
    if (this.supplier !== null && this.supplier !== undefined) {
      this.supplier.deliveryFee;
    }
    return deliveryFee;
  }

  getPackagingFee(): number {
    var packagingFee = 0.0;
    if (this.supplier !== null && this.supplier !== undefined) {
      this.supplier.packagingFee;
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

  setData(data: FoodOrder) {
    console.info('Storing food order..');
    this.localService.saveData(
      Constants.StorageItem_F_Order,
      JSON.stringify(data)
    );
    this.orderSubject$.next(this.foodOrder);
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
    console.log('Purging food order.');
    this.localService.removeData(Constants.StorageItem_F_Order);
    this.foodOrder = null;
    this.orderSubject$.next(null);
  }

  getData() {
    var json = this.localService.getData(Constants.StorageItem_F_Order);
    console.log('FoodOrder in storage ' + json);
    if (Utils.isValid(json) && this.isJsonString(json)) {
      var obj = JSON.parse(json);
      this.foodOrder = obj.constructor.name === 'Array' ? obj[0] : obj;
      console.log('FoodOrder object' + JSON.stringify(this.foodOrder));
      this.orderSubject$.next(this.foodOrder);
    } else {
      this.createOrder();
    }
  }

  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  destroy() {
    this.purgeData();
  }

  convertPartyOrder() {
    if ( this.foodOrder && !this.foodOrder.partyOrder){
      console.log('Converting regular food order to party order')
      this.foodOrder.partyOrder = true;
      this.foodOrder.items = [];
      this.foodOrder.partyItems = [];
      this.foodOrder.subTotal= 0;
      this.foodOrder.total= 0;
      this.foodOrder.serviceFee =0;
      this.foodOrder.reference ='';
      this.foodOrder.notes ='';
    }
  }
}
