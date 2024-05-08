import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServiceLocator } from './service.locator';
import { Address, PostcodeDistrict, ServiceLocation } from 'src/app/model/common';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private customerAddress?: Address;
  public customerAddress$ = new BehaviorSubject(this.customerAddress);

  constructor(private http: HttpClient,
    private serviceLocator: ServiceLocator
  ) {
  }

  setCustomerAddress(address: Address) {
    this.customerAddress = address;
    this.customerAddress$.next(this.customerAddress);
  }

  fetchLocalAreas(searchText: string): Observable<ServiceLocation[]> {
    var params = new HttpParams();
    if (searchText !== undefined && searchText !== null) {
      params = params.set('text', searchText);
    }
    console.log('Lookup ServiceLocations for : ' + params)
    return this.http.get<ServiceLocation[]>(this.serviceLocator.ServiceAreasUrl, { params });
  }

  getLocation(slug: string): Observable<ServiceLocation> {
    var params = new HttpParams();
    if (slug !== undefined && slug !== null) {
      params = params.set('slug', slug);
    }
    return this.http.get<ServiceLocation>(this.serviceLocator.ServiceAreasUrl, { params });
  }

  fetchPostcodeDistricts(prefix: string, area: string): Observable<PostcodeDistrict[]> {
    var params = new HttpParams();
    if (prefix) {
      params = params.set('prefix', prefix);
    }
    if (area) {
      params = params.set('area', area);
    }
    console.log('Lookup postcode districts for : ' + params)
    return this.http.get<PostcodeDistrict[]>(this.serviceLocator.PostcodeDistrictsUrl, { params });
  }

  fetchOne(_id: string): Observable<PostcodeDistrict> {
    return this.http.get<PostcodeDistrict>(this.serviceLocator.PostcodeDistrictsUrl + "/" + _id);
  }

}