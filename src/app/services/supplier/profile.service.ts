import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CloudKitchen, Cuisine } from 'src/app/model/all-foods';
import { AccountService } from '../auth/account.service';
import { LocalService } from '../common/local.service';
import { PostcodeDistrict } from 'src/app/model/common';
import { ServiceLocator } from '../common/service.locator';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  public cloudKitchen$ = new BehaviorSubject<CloudKitchen>(null);
  private storageItem = 'cloud-kitchen';

  constructor(
    private http: HttpClient,
    private authSvc: AccountService,
    private serviceLocator: ServiceLocator,
    private localService: LocalService
  ) {}

  purgeChef() {
    console.log('Purging cloudKitchen.');
    this.localService.removeData(this.storageItem);
    this.cloudKitchen$.next(null);
  }

  getChef(): Observable<CloudKitchen> {
    var user = this.authSvc.getCurrentUser();
    if (user != null && user !== undefined) {
      return this.fetchChef(user.email);
    }
    return null;
  }

  fetchChef(email: string) {
    var params = new HttpParams();
    params = params.set('email', email);
    return this.http
      .get<CloudKitchen>(this.serviceLocator.CloudKitchenUrl, { params })
      .pipe(
        tap((data) => {
          this.setChef(data[0]);
        })
      );
  }

  saveChef(cloudKitchen: CloudKitchen): Observable<CloudKitchen> {
    return this.http.post<CloudKitchen>(this.serviceLocator.CloudKitchenUrl, cloudKitchen).pipe(
      tap((result) => {
        // this.fetchChef(result.email);
        this.setChef(result);
      })
    );
  }

  updateChef(cloudKitchen: CloudKitchen): Observable<CloudKitchen> {
    return this.http
      .put<CloudKitchen>(this.serviceLocator.CloudKitchenUrl + '/' + cloudKitchen._id, cloudKitchen)
      .pipe(
        tap((result) => {
          // this.fetchChef(result.email);
          this.setChef(result);
        })
      );
  }

  setChef(result: CloudKitchen) {
    this.localService.saveData(this.storageItem, JSON.stringify(result));
    this.cloudKitchen$.next(result);
  }

  getCurrentChef(): CloudKitchen {
    var json = this.localService.getData(this.storageItem);
    if (json !== '' && json !== null && json !== undefined) {
      var obj = JSON.parse(json);
      return obj.constructor.name === 'Array' ? obj[0] : obj;
    }
    return null;
  }

  fetchAllServiceAreas(city: string): Observable<PostcodeDistrict[]> {
    var params = new HttpParams();
    if (city !== undefined && city !== null) {
      params = params.set('city', city);
    }
    return this.http.get<PostcodeDistrict[]>(
      this.serviceLocator.PostcodeDistrictUrl,
      { params }
    );
  }

  fetchAllCuisine(): Observable<Cuisine[]> {
    return this.http.get<Cuisine[]>(this.serviceLocator.cuisinesUrl);
  }

  getCuisineById(id: string): Observable<Cuisine> {
    return this.http.get<Cuisine>(this.serviceLocator.cuisinesUrl + '/' + id);
  }

  createNewChef(cloudKitchen: CloudKitchen): Observable<CloudKitchen> {
    return this.http.post<CloudKitchen>(this.serviceLocator.CloudKitchenUrl, cloudKitchen);
  }
}
