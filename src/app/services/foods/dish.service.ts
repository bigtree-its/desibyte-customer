import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dish } from '../model/localchef';
import { ServiceLocator } from './service.locator';

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