import { Injectable, inject } from '@angular/core';
import { AdSearchQuery, PropertyAd } from 'src/app/model/all-ads';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServiceLocator } from '../common/service.locator';
import { Observable, tap } from 'rxjs';
import { Utils } from '../common/utils';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
 
 
  private httpClient = inject(HttpClient);
  private serviceLocator = inject(ServiceLocator);

  postProperty(propertyAd: PropertyAd) {
    console.log('Posting a property ad '+ JSON.stringify(propertyAd));
    return this.httpClient
      .post<PropertyAd>(this.serviceLocator.AdPropertyUrl, propertyAd)
      .pipe(
        tap((result) => {
          console.log('Property Ad post response ' + JSON.stringify(result));
        })
      );
  }

  getProperties(query: AdSearchQuery): Observable<PropertyAd[]>{
    var params = new HttpParams();
    if (query.fromDate) {
      params = params.set('fromDate', Utils.getDateString(query.fromDate));
    }
    if (query.toDate) {
      params = params.set('toDate', Utils.getDateString(query.toDate));
    }
    if (query.reference) {
      params = params.set('reference',  query.reference);
    }
    if (query.min) {
      params = params.set('min',  query.min);
    }
    if (query.max) {
      params = params.set('max',  query.max);
    }
    if (query.adOwner) {
      params = params.set('adOwner',  query.adOwner);
    }
    if (query.lastWeek) {
      params = params.set('lastWeek',  true);
    }
    if (query.lastMonth) {
      params = params.set('lastMonth',  true);
    }
    return this.httpClient.get<PropertyAd[]>(this.serviceLocator.AdPropertyUrl, { params });
  }

  getProperty(reference: string): Observable<PropertyAd[]>{
    var params = new HttpParams();
    if (reference) {
      params = params.set('reference',  reference);
    }
    return this.httpClient.get<PropertyAd[]>(this.serviceLocator.AdPropertyUrl, { params });
  }

}
