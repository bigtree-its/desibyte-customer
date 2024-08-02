import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  Calendar,
  CloudKitchen,
  Collection,
  CloudKitchenSearchQuery,
  Menu,
  PartyBundle,
} from 'src/app/model/all-foods';
import { LocalService } from '../common/local.service';
import { ServiceLocator } from '../common/service.locator';
import { Constants } from '../common/constants';

@Injectable({
  providedIn: 'root',
})
export class CloudKitchenService {
  ipAddress: string | undefined;
  configUrl = 'assets/static/location.json';
  private cloudKitchen: CloudKitchen = undefined;
  public cloudKitchenSubject$ = new BehaviorSubject(this.cloudKitchen);

  constructor(
    private http: HttpClient,
    private localService: LocalService,
    private serviceLocator: ServiceLocator
  ) {}

  saveKitchen(kitchen: CloudKitchen): Observable<CloudKitchen> {
    console.log('Saving kitchen');
    var url = this.serviceLocator.CloudKitchenUrl;
    if (kitchen._id) {
      url = this.serviceLocator.CloudKitchenUrl + '/' + kitchen._id;
      return this.http.put<CloudKitchen>(url, kitchen).pipe(
        tap((result) => {
          console.log('Updated kitchen ' + result._id);
          this.setCloudKitchenOnBrowserStorage(result);
        })
      );
    } else {
      return this.http.post<CloudKitchen>(url, kitchen).pipe(
        tap((result) => {
          console.log('Saved kitchen ' + result._id);
          this.setCloudKitchenOnBrowserStorage(result);
        })
      );
    }
  }

  getAllCloudKitchens(
    query: CloudKitchenSearchQuery
  ): Observable<CloudKitchen[]> {
    console.log('Getting cloud kitchens for : ' + JSON.stringify(query));
    var params = new HttpParams();
    if (query.cuisines !== undefined && query.cuisines !== null) {
      params = params.set('cuisines', query.cuisines);
    }
    if (query.dishes !== undefined && query.dishes !== null) {
      params = params.set('dishes', query.dishes);
    }
    if (query.dishes !== undefined && query.dishes !== null) {
      params = params.set('keywords', query.keywords);
    }
    if (query.doDelivery) {
      params = params.set('doDelivery', query.doDelivery);
    }
    if (query.doPartyOrders) {
      params = params.set('doPartyOrders', query.doPartyOrders);
    }
    if (query.serviceAreas) {
      params = params.set('serviceAreas', query.serviceAreas);
    }

    if (query.open) {
      params = params.set('open', query.open);
    }
    if (query.email) {
      params = params.set('email', query.email);
    }
    if (query.minimumOrder) {
      params = params.set('minimumOrder', query.minimumOrder);
    }
    return this.http.get<CloudKitchen[]>(this.serviceLocator.CloudKitchenUrl, {
      params,
    });
  }

  retrieveKitchen(id: string): Observable<CloudKitchen> {
    console.log('Retrieving kitchen ' + id);
    var url = this.serviceLocator.CloudKitchenUrl + '/' + id;
    return this.http.get<CloudKitchen>(url).pipe(
      tap((data) => {
        this.setCloudKitchenOnBrowserStorage(data);
      })
    );
  }

  getPartyBundleForChef(cloudKitchenId: string): Observable<PartyBundle[]> {
    var params = new HttpParams();
    if (cloudKitchenId !== undefined && cloudKitchenId !== null) {
      params = params.set('cloudKitchen', cloudKitchenId);
    }
    console.log('Fetching party bundles for : ' + params);
    return this.http.get<PartyBundle[]>(this.serviceLocator.PartyBundlesUrl, {
      params,
    });
  }

  getMenusForKitchen(cloudKitchenId: string): Observable<Menu[]> {
    var params = new HttpParams();
    if (cloudKitchenId !== undefined && cloudKitchenId !== null) {
      params = params.set('cloudKitchenId', cloudKitchenId);
    }
    console.log('Fetching menus for : ' + params);
    return this.http.get<Menu[]>(this.serviceLocator.menusUrl, { params });
  }

  getCalendars(
    cloudKitchenId: string,
    thisWeek: boolean,
    thisMonth: boolean
  ): Observable<Calendar[]> {
    var params = new HttpParams();
    if (cloudKitchenId !== undefined && cloudKitchenId !== null) {
      params = params.set('cloudKitchen', cloudKitchenId);
    }
    if (thisWeek !== undefined && thisWeek) {
      params = params.set('thisweek', 'true');
    }
    if (thisMonth !== undefined && thisMonth) {
      params = params.set('thisMonth', 'true');
    }

    console.log('Fetching calendars for : ' + params);
    return this.http.get<Calendar[]>(this.serviceLocator.calendersUrl, {
      params,
    });
  }

  getCollections(cloudKitchenId: string): Observable<Collection[]> {
    var params = new HttpParams();
    if (cloudKitchenId) {
      params = params.set('cloudKitchenId', cloudKitchenId);
    }
    return this.http.get<Collection[]>(this.serviceLocator.collectionsUrl, {params});
  }

  getIPAddress() {
    this.http.get('http://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
      console.log(this.ipAddress);
      return this.ipAddress;
    });
  }

  getStaticIP() {
    return '123.235.324.1';
  }

  getLocations() {
    return this.http.get<Location[]>(this.configUrl);
  }

  setCloudKitchenOnBrowserStorage(cloudKitchen: CloudKitchen) {
    this.cloudKitchen = cloudKitchen;
    this.localService.saveData(
      Constants.StorageItem_CloudKitchen,
      JSON.stringify(cloudKitchen)
    );
    this.cloudKitchenSubject$.next(cloudKitchen);
  }

  purgeCloudKitchen() {
    console.log('Purging cloudKitchen.');
    this.localService.removeData(Constants.StorageItem_CloudKitchen);
    this.cloudKitchen = null;
    this.cloudKitchenSubject$.next(null);
  }

  getData(): CloudKitchen {
    var json = this.localService.getData(Constants.StorageItem_CloudKitchen);
    if (json === undefined) {
      return undefined;
    }
    if (json !== '' && json !== null && json !== undefined) {
      var obj = JSON.parse(json);
      this.cloudKitchen = obj.constructor.name === 'Array' ? obj[0] : obj;
      this.cloudKitchenSubject$.next(this.cloudKitchen);
    }
    return this.cloudKitchen;
  }
}
