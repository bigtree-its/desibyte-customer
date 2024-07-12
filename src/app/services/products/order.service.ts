import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable, BehaviorSubject, of } from 'rxjs';
import { Order, OrderItem, OrderQuery, SaleOrder } from 'src/app/model/all-products';
import { LocalService } from '../common/local.service';
import { ServiceLocator } from '../common/service.locator';
import { Constants } from '../common/constants';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  ipAddress: any;
  private order?: Order;
  public orderSubject$ = new BehaviorSubject(this.order);
  public orderListSubject$ = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private localService: LocalService,
    private serviceLocator: ServiceLocator
  ) {}

  action(reference: string, action: string): Observable<Order> {
    const params = new HttpParams({
      fromString: 'ref=' + reference + '&action=' + action,
    });
    var url = this.serviceLocator.ProductOrdersUrl + '/action';
    console.log('Action on order ' + url + '. Params: ' + params);
    return this.http.put<Order>(url, params).pipe(
      tap((result) => {
        this.setData(result);
      })
    );
  }

  saveOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.serviceLocator.ProductOrdersUrl, order).pipe(
      tap((result) => {
        this.setData(result);
      })
    );
  }

  saveSaleOrder(order: SaleOrder): Observable<SaleOrder> {
    return this.http.post<SaleOrder>(this.serviceLocator.ProductOrdersUrl, order).pipe(
      tap((result) => {
        // this.setData(result);
      })
    );
  }


  retrieveOrders(query: OrderQuery): Observable<Order[]> {
    var url = this.serviceLocator.ProductOrdersUrl;
    console.log('Fetching customer orders ' + url);
    return this.http.post<Order[]>(url, query);
  }

 
  private getIPAddress() {
    this.http.get('http://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  public addToOrder(item: OrderItem) {
    console.log('Adding item ' + JSON.stringify(item));
    console.log('To order ' + JSON.stringify(this.order));
    if (this.order === null || this.order === undefined) {
      this.getData();
    }
    if (
      this.order != null &&
      this.order !== undefined &&
      this.order.items === null
    ) {
      this.order.items = [];
    }

    this.order.items.push(item);
    this.calculateTotal();
  }

  removeItem(item: OrderItem) {
    if (this.order !== null && this.order !== undefined) {
      for (var i = 0; i < this.order.items.length; i++) {
        var _item = this.order.items[i];
        if (_item._tempId === item._tempId) {
          this.order.items.splice(i, 1);
        }
      }
    }
    this.calculateTotal();
  }

  updateItem(item: OrderItem) {
    var idx = -1;
    console.log('Updating item ' + JSON.stringify(item));
    if (this.order !== null && this.order !== undefined) {
      for (var i = 0; i < this.order.items.length; i++) {
        var fi = this.order.items[i];
        if (fi._tempId === item._tempId) {
          console.log('Found existing item at index ' + i);
          idx = i;
          break;
        }
      }

      if (idx != -1) {
        const newItems = [
          ...this.order.items.slice(0, idx),
          item,
          ...this.order.items.slice(idx + 1),
        ];
        this.order.items = newItems;
        // this.order.items.splice(i, 1);
        // this.order.items.push(item);
        this.calculateTotal();
      }
    }
  }

  public calculateTotal() {
    var subTotal: number = 0.0;
    if (
      this.order.items !== null &&
      this.order.items !== undefined &&
      this.order.items.length > 0
    ) {
      this.order.items.forEach((item) => {
        subTotal = subTotal + item.subTotal;
      });
    }
    this.order.deliveryFee = 0.0;
    this.order.packingFee = 0.0;
    this.order.serviceFee = 0.0;
    this.order.subTotal = subTotal;
    if (subTotal !== 0) {
      this.order.serviceFee = 0.5;
      if (this.order.serviceMode === 'DELIVERY') {
        this.order.deliveryFee = 0.5;
      }
    }

    var totalToPay: number =
      this.order.subTotal +
      this.order.deliveryFee +
      this.order.packingFee +
      this.order.serviceFee;
    console.log('Calculating SubTotal: ' + subTotal);
    console.log('Calculating TotalPay: ' + totalToPay);
    this.order.total = totalToPay;
    this.order.total = +(+this.order.total).toFixed(2);
    console.log('The calculated order total: ' + this.order.total);
    this.setData(this.order);
  }

  
  public createOrder() {
    console.log('Creating empty new order');
    
    this.order = {
      id: '',
      status: 'Draft',
      items: [],
      customer: {
        _id: '',
        name: '',
        mobile: '',
        email: '',
        telephone: '',
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
      currency: 'GBP',
      reference: '',
      subTotal: 0.0,
      total: 0.0,
      deliveryFee: this.getDeliveryFee(),
      packingFee: this.getPackagingFee(),
      serviceFee: 0.0,
      dateCreated: new Date(),
      dateAccepted: null,
      expectedDeliveryDate: null,
      dateCollected: null,
      dateDelivered: null,
      collectBy: null,
      dateDeleted: null,
      serviceMode: 'COLLECTION',
      notes: '',
    };
    console.log('Created a brand new Order ' + JSON.stringify(this.order));
  }
  
  getPackagingFee(): number {
   return 0.5;
  }

  getDeliveryFee(): number {
    return 2.00;
  }

  setData(data: Order) {
    console.info('Storing product order..');
    this.localService.saveData(
      Constants.StorageItem_Product_Order,
      JSON.stringify(data)
    );
    this.orderSubject$.next(this.order);
  }

  purgeData() {
    console.log('Purging product and service order.');
    this.localService.removeData(Constants.StorageItem_Product_Order);
    this.order = null;
    this.orderSubject$.next(null);
  }

  getData() {
    var json = this.localService.getData(Constants.StorageItem_Product_Order);
    console.log('Order in local storage ' + json);
    if (this.isJsonString(json)) {
      var obj = JSON.parse(json);
      this.order = obj.constructor.name === 'Array' ? obj[0] : obj;
      this.orderSubject$.next(this.order);
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
}
