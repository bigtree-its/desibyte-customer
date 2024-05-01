import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalService } from './local.service';
import { ServiceLocator } from './service.locator';
import { Review } from 'src/app/model/common';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  

  constructor(private http:HttpClient,
    private localService: LocalService,
    private serviceLocator: ServiceLocator) { }

  getReviews(chef: string): Observable<Review[]> {

    var params = new HttpParams();
    if (chef !== undefined && chef !== null) {
      params = params.set('chef', chef);
    }
    console.log('Fetching reviews for : ' + params)
    return this.http.get<Review[]>(this.serviceLocator.ReviewsUrl, { params });
  }

  createReview(review: Review): Observable<Review> {
    console.log('Submitting review to server..');
    return this.http
      .post<Review>(this.serviceLocator.ReviewsUrl, review
      )
      .pipe(
        tap((result) => {
          console.log('Review submission response ' + JSON.stringify(result));
        })
      );
  }
}
