import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceLocator } from '../common/service.locator';
import { Cuisine } from 'src/app/model/all-foods';

@Injectable({
  providedIn: 'root',
})
export class CuisinesService {

  constructor(private http:HttpClient,
    private serviceLocator: ServiceLocator) {}

  getCuisines(): Observable<Cuisine[]> {
    return this.http.get<Cuisine[]>(this.serviceLocator.cuisinesUrl);
  }

  getSingleCuisine(slug: string): Observable<Cuisine>{
    var params = new HttpParams();
    if (slug !== undefined && slug !== null) {
      params = params.set('slug', slug);
    }
    return this.http.get<Cuisine>(this.serviceLocator.cuisinesUrl, { params });
  }

}