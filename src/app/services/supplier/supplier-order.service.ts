import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { formatDate } from "@angular/common";
import { ServiceLocator } from '../common/service.locator';
import { KitchenOrder, KitchenOrderProfileResponse, KitchenOrderTracking } from 'src/app/model/all-food-supplier';

@Injectable({
  providedIn: 'root',
})
export class SupplierOrderService {

  storageItem: string = "sf-orders";
  public orderSubject$: BehaviorSubject<KitchenOrderProfileResponse> = new BehaviorSubject<KitchenOrderProfileResponse>(null);

  constructor(private http: HttpClient, private serviceLocator: ServiceLocator) {}

  getOrders(email: string, period: string): Observable<KitchenOrder[]> {

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    if ( period === "LastMonth"){
      date.setMonth(date.getMonth() - 1);
      m = date.getMonth();
      firstDay = new Date(y, m, 1);
    }
   
    var lastDay = new Date(y, m + 1, 0);
    var params = new HttpParams();
    if (email !== null && email !== undefined) {
      params = params.set('supplier', email);
    }
    params = params.set('dateFrom', formatDate(firstDay, 'dd/MM/yyyy', 'en-GB'));
    params = params.set('dateTo', formatDate(lastDay, 'dd/MM/yyyy', 'en-GB'));

    return this.http.get<KitchenOrder[]>(this.serviceLocator.FoodOrdersUrl, {params});
  }

  getProfile(id: string): Observable<KitchenOrderProfileResponse> {
    var params = new HttpParams();
    params = params.set('cloudKitchenId', id);
    console.log('Fetching order profile for kitchen ', id)
    return this.http.get<KitchenOrderProfileResponse>(this.serviceLocator.KitchenOrderProfileUrl, {params}).pipe(
      tap(result => {
        localStorage.setItem(this.storageItem, JSON.stringify(result));
        this.orderSubject$.next(result);
      })
    );
  }

  getLocalOrders(): KitchenOrderProfileResponse {
    var s = localStorage.getItem(this.storageItem);
    if (s !== null && s !== undefined) {
     return JSON.parse(s);
    }
    return null;
  }

  updateStatus(tracking: KitchenOrderTracking): Observable<KitchenOrderTracking>{
    var url = 'http://localhost:8080/api/order-tracking';
    return this.http.post<KitchenOrderTracking>(url, tracking);
  }
}
