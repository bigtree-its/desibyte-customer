import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceLocator } from './service.locator';
import { Image } from 'src/app/model/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {


  constructor(private http: HttpClient,
    private serviceLocator: ServiceLocator
  ) {
  }


  fetchImages(reference: string): Observable<Image[]> {
    var params = new HttpParams();
    if (reference) {
      params = params.set('reference', reference);
    }
    console.log('Fetching images for reference : ' + reference)
    return this.http.get<Image[]>(this.serviceLocator.ImagesUrl, { params });
  }

}