import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceLocator } from '../common/service.locator';
import { Product } from 'src/app/model/all-products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http=inject(HttpClient);
  serviceLocator=inject(ServiceLocator);

  constructor() { }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(this.serviceLocator.productsUrl+"/"+ id);
  }
}
