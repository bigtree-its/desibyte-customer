import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceLocator } from '../common/service.locator';
import { Dish } from 'src/app/model/all-foods';

@Injectable({
  providedIn: 'root',
})
export class DishService {

  constructor(private http:HttpClient,
    private serviceLocator: ServiceLocator) {}

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.serviceLocator.DishesUrl);
  }

}