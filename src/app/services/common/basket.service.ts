import { Injectable, inject } from '@angular/core';
import { OrderService } from '../products/order.service';
import { LocalService } from './local.service';
import { ToastService } from './toast.service';
import { OrderItem } from 'src/app/model/all-products';
import { FoodOrderItem, PartyOrderItem } from 'src/app/model/all-foods';
import { FoodOrderService } from '../foods/food-order.service';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  pOrderService = inject(OrderService);
  fOrderService = inject(FoodOrderService);
  localService = inject(LocalService);
  toastService = inject(ToastService);

  addToProductOrder(OrderItem: OrderItem) {
    console.log('Adding a product to cart');
    this.pOrderService.addToOrder(OrderItem);
  }

  addToFoodOrder(foodItem: FoodOrderItem) {
    console.log('Adding a food to cart');
    this.fOrderService.addToOrder(foodItem);
  }

  addPartyItem(partyItem: PartyOrderItem) {
    console.log('Adding party item to cart');
    this.fOrderService.addPartyItemToOrder(partyItem);
  }
}
