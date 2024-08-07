import { Injectable, inject } from '@angular/core';
import {
  AdEnquiry,
  AdEnquiryResponse,
  AdSearchQuery,
  GeneralAd,
  PropertyAd,
  PropertySearchQuery,
} from 'src/app/model/all-ads';
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

  sendEnquiry(enquiry: AdEnquiry): Observable<AdEnquiry> {
    console.log('Posting a enquiry for ad ' + JSON.stringify(enquiry));
    return this.httpClient
      .post<AdEnquiry>(this.serviceLocator.AdEnquiryUrl, enquiry)
      .pipe(
        tap((result) => {
          console.log('Ad enquiry response ' + JSON.stringify(result));
        })
      );
  }

  respondEnquiry(enquiry: AdEnquiry): Observable<AdEnquiry> {
    console.log('Posting a response to enquiry ' + JSON.stringify(enquiry));
    return this.httpClient
      .put<AdEnquiry>(
        this.serviceLocator.AdEnquiryUrl + '/' + enquiry._id,
        enquiry
      )
      .pipe(
        tap((result) => {
          console.log('Posted response to enquiry ' + JSON.stringify(result));
        })
      );
  }

  getEnquiries(reference: string, category: string): Observable<AdEnquiry[]> {
    var params = new HttpParams();
    if (reference) {
      params = params.set('reference', reference);
    }
    if (category) {
      params = params.set('category', category);
    }

    console.log('Fetching enquiries for ad  ' + JSON.stringify(params));
    return this.httpClient.get<AdEnquiry[]>(this.serviceLocator.AdEnquiryUrl, {
      params,
    });
  }

  getImageKitToken(req: any): Observable<any> {
    return this.httpClient
      .post<any>(this.serviceLocator.ImageKitTokenUrl, req)
      .pipe(
        tap((result) => {
          console.log('ImageKit Token ' + JSON.stringify(result));
        })
      );
  }

  deleteImage(fileId: string): Observable<any> {
    return this.httpClient
      .delete<any>(this.serviceLocator.ImageKitFilesUrl + '/' + fileId)
      .pipe(
        tap((result) => {
          console.log('Image deleted ' + result);
        })
      );
  }

  getMyMessages(customerEmail: string): Observable<AdEnquiry[]> {
    var params = new HttpParams();
    if (customerEmail) {
      params = params.set('customer', customerEmail);
    }

    console.log('Fetching messages for customer  ' + JSON.stringify(params));
    return this.httpClient.get<AdEnquiry[]>(this.serviceLocator.AdEnquiryUrl, {
      params,
    });
  }

  postAd(ad: GeneralAd): Observable<GeneralAd> {
    console.log('Posting an ad ' + JSON.stringify(ad));
    return this.httpClient.post<GeneralAd>(this.serviceLocator.AdsUrl, ad).pipe(
      tap((result) => {
        console.log('Post Ad response ' + JSON.stringify(result));
      })
    );
  }

  uploadImages(ad: GeneralAd, formData: FormData): Observable<GeneralAd> {
    console.log('Uploading images for an ad ' + ad.reference);
    var params = new HttpParams();
    params = params.set('adReference', ad.reference);
    params = params.set('adCategory', ad.category);
    return this.httpClient
      .post<GeneralAd>(this.serviceLocator.UploadImagesUrl, formData, {
        params,
      })
      .pipe(
        tap((result) => {
          console.log('Upload image response ' + JSON.stringify(result));
        })
      );
  }

  postProperty(propertyAd: PropertyAd): Observable<PropertyAd> {
    console.log('Posting a property ad ' + JSON.stringify(propertyAd));
    return this.httpClient
      .post<PropertyAd>(this.serviceLocator.AdPropertyUrl, propertyAd)
      .pipe(
        tap((result) => {
          console.log('Property Ad post response ' + JSON.stringify(result));
        })
      );
  }

  getProperties(query: PropertySearchQuery): Observable<PropertyAd[]> {
    var params = new HttpParams();
    if (query.reference) {
      params = params.set('reference', query.reference);
    }
    if (query.minAmount) {
      params = params.set('minAmount', query.minAmount);
    }
    if (query.maxAmount) {
      params = params.set('maxAmount', query.maxAmount);
    }
    if (query.minBedroom) {
      params = params.set('minBedroom', query.minBedroom);
    }
    if (query.maxBedroom) {
      params = params.set('maxBedroom', query.maxBedroom);
    }
    if (query.adOwner) {
      params = params.set('adOwner', query.adOwner);
    }
    if (query.consumptionType) {
      params = params.set('consumptionType', query.consumptionType);
    }
    if (query.type) {
      params = params.set('type', query.type);
    }
    console.log('Finding properties with query ' + JSON.stringify(query));
    return this.httpClient.get<PropertyAd[]>(
      this.serviceLocator.AdPropertyUrl,
      { params }
    );
  }

  getAds(query: AdSearchQuery): Observable<GeneralAd[]> {
    var params = new HttpParams();
    if (query.category) {
      params = params.set('category', query.category);
    }
    if (query.reference) {
      params = params.set('reference', query.reference);
    }
    if (query.minAmount) {
      params = params.set('minAmount', query.minAmount);
    }
    if (query.maxAmount) {
      params = params.set('maxAmount', query.maxAmount);
    }
    if (query.adOwner) {
      params = params.set('adOwner', query.adOwner);
    }
    if (query.lastWeek) {
      params = params.set('lastWeek', query.lastWeek);
    }
    if (query.lastMonth) {
      params = params.set('lastMonth', query.lastMonth);
    }
    if (query.postcodeDistrict) {
      params = params.set('postcodeDistrict', query.postcodeDistrict);
    }
    if (query.city) {
      params = params.set('city', query.city);
    }
    if (query.postcode) {
      params = params.set('postcode', query.postcode);
    }
    if (query.coverage) {
      params = params.set('coverage', query.coverage);
    }
    console.log('Finding ads with query ' + JSON.stringify(params));
    return this.httpClient.get<GeneralAd[]>(this.serviceLocator.AdsUrl, {
      params,
    });
  }


  deleteAd(ref: string): Observable<any> {
    return this.httpClient
      .delete<any>(this.serviceLocator.AdsUrl + '/' + ref)
      .pipe(
        tap((result) => {
          console.log('Ad deleted ' + result);
        })
      );
  }

  updateProperty(property: PropertyAd): Observable<PropertyAd> {
    console.log('Updating property ' + JSON.stringify(property));
    return this.httpClient
      .put<PropertyAd>(this.serviceLocator.AdPropertyUrl +"/" + property.reference, property)
      .pipe(
        tap((result) => {
          console.log('Property update response ' + JSON.stringify(result));
        })
      );
  }

  updateAd(ad: GeneralAd): Observable<GeneralAd> {
    console.log('Updating ad ' + JSON.stringify(ad));
    return this.httpClient
      .put<GeneralAd>(this.serviceLocator.AdsUrl +"/" + ad.reference, ad)
      .pipe(
        tap((result) => {
          console.log('Ad update response ' + JSON.stringify(result));
        })
      );
  }

  deleteProperty(ref: string): Observable<any> {
    return this.httpClient
      .delete<any>(this.serviceLocator.AdPropertyUrl + '/' + ref)
      .pipe(
        tap((result) => {
          console.log('Property deleted ' + result);
        })
      );
  }

  getProperty(reference: string): Observable<PropertyAd[]> {
    var params = new HttpParams();
    if (reference) {
      params = params.set('reference', reference);
    }
    return this.httpClient.get<PropertyAd[]>(
      this.serviceLocator.AdPropertyUrl,
      { params }
    );
  }
}
