import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceLocator } from '../common/service.locator';
import { Group, Product } from 'src/app/model/all-products';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  

  http=inject(HttpClient);
  serviceLocator=inject(ServiceLocator);

  constructor() { }

  getAllGroups(dept: string): Observable<Group[]> {
    var params = new HttpParams();
    if (dept !== null && dept !== undefined) {
      params = params.set('dept', dept);
    }
    console.log('Fetching groups for '+ dept)
    return this.http.get<Group[]>(this.serviceLocator.groupsUrl, {params: params});
  }

  getProducts(group: string) :Observable<Product[]>{
    var params = new HttpParams();
    if (group !== null && group !== undefined) {
      params = params.set('group', group);
    }
    console.log('Fetching products for '+ group)
    return this.http.get<Product[]>(this.serviceLocator.productsUrl, {params: params});
  }
}
