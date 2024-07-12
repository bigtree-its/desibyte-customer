import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServiceLocator } from './service.locator';
import { Address, PostcodeDistrict, PostcodeDistrictQuery, ServiceLocation } from 'src/app/model/common';

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
    return this.http.get<ServiceLocation[]>(this.serviceLocator.PostcodeDistrictUrl, { params });
  }

  getLocation(slug: string): Observable<ServiceLocation> {
    var params = new HttpParams();
    if (slug !== undefined && slug !== null) {
      params = params.set('slug', slug);
    }
    return this.http.get<ServiceLocation>(this.serviceLocator.PostcodeDistrictUrl, { params });
  }

  fetchPostcodeDistricts(query: PostcodeDistrictQuery): Observable<PostcodeDistrict[]> {
    var params = new HttpParams();
    if (query.prefix) {
      params = params.set('prefix', query.prefix);
    }
    if (query.council) {
      params = params.set('council', query.council);
    }
    if (query.area) {
      params = params.set('area', query.area);
    }
    if (query.coverage) {
      params = params.set('coverage', query.coverage);
    }
    if (query.popular) {
      params = params.set('popular', query.popular);
    }
    console.log('Lookup postcode districts for : ' + params);
    return this.http.get<PostcodeDistrict[]>(this.serviceLocator.PostcodeDistrictUrl, { params });
  }

  fetchOne(_id: string): Observable<PostcodeDistrict> {
    return this.http.get<PostcodeDistrict>(this.serviceLocator.PostcodeDistrictUrl + "/" + _id);
  }

}