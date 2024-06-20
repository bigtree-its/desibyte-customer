import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Collection, Menu } from 'src/app/model/all-foods';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  
  
  private menuSvcUrl: string = 'http://localhost:8083/ads/v1/menus';
  private collectionsUrl: string = 'http://localhost:8083/ads/v1/collections';

  constructor(private http: HttpClient) {}

  getMenus(cloudKitchenId: string): Observable<Menu[]> {
    var params = new HttpParams();
    if (cloudKitchenId) {
      params = params.set('cloudKitchenId', cloudKitchenId);
    }
    return this.http.get<Menu[]>(this.menuSvcUrl, { params });
  }

  getCollections(cloudKitchenId: string): Observable<Collection[]> {
    var params = new HttpParams();
    if (cloudKitchenId) {
      params = params.set('chef', cloudKitchenId);
    }
    return this.http.get<Collection[]>(this.collectionsUrl, { params });
  }

  createNewFood(menu: any): Observable<Menu> {
    return this.http.post<Menu>(this.menuSvcUrl, menu);
  }

  updateMenu(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(this.menuSvcUrl+"/"+ menu._id, menu);
  }

  saveCollection(collectionName: string, cloudKitchenId: string): Observable<Collection> {
    var collection: Collection = {
      name: collectionName,
      cloudKitchenId: cloudKitchenId,
      slug: undefined,
      image: undefined,
      _id: undefined,
    }
    return this.http.post<Collection>(this.collectionsUrl, collection);
  }

  updateFood(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(this.menuSvcUrl, menu);
  }

  deleteFood(menu: Menu): Observable<any> {
    var url = this.menuSvcUrl + '/' + menu._id;
    return this.http.delete<any>(url);
  }

  deleteCollection(collection: Collection): Observable<any> {
    var url = this.collectionsUrl + '/' + collection._id;
    return this.http.delete<any>(url);
  }
}
