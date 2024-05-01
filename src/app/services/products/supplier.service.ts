import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceLocator } from '../common/service.locator';
import { Supplier } from 'src/app/model/common';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  

  http=inject(HttpClient);
  serviceLocator=inject(ServiceLocator);

  constructor() { }

  getSupplier(_id: String): Observable<Supplier> {
    console.log('Fetching supplier '+ _id)
    return this.http.get<Supplier>(this.serviceLocator.SupplierUrl+"/"+ _id);
  }

}
