import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceLocator } from './service.locator';
import { ServiceLocation } from 'src/app/model/common';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor( private http: HttpClient,
    private serviceLocator: ServiceLocator
    ) { }

  fetchLocalAreas(searchText: string): Observable<ServiceLocation[]> {
    var params = new HttpParams();
    if (searchText !== undefined && searchText !== null) {
      params = params.set('text', searchText);
    }
    console.log('Lookup ServiceLocations for : ' + params)
    return this.http.get<ServiceLocation[]>(this.serviceLocator.ServiceAreasUrl, { params });
  }

  getLocation(slug: string): Observable<ServiceLocation>{
    var params = new HttpParams();
    if (slug !== undefined && slug !== null) {
      params = params.set('slug', slug);
    }
    return this.http.get<ServiceLocation>(this.serviceLocator.ServiceAreasUrl, { params });
  }
}