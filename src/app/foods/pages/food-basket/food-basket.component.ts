import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft, faBatteryEmpty, faFaceSmile, faPeopleArrows, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CloudKitchen, FoodOrder } from 'src/app/model/all-foods';
import { Utils } from 'src/app/services/common/utils';
import { CloudKitchenService } from 'src/app/services/foods/cloudkitchen.service';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';



@Component({
  selector: 'app-basket',
  templateUrl: './food-basket.component.html',
  styleUrls: ['./food-basket.component.css']
})
export class FoodBasketComponent {

  @Input() standAlone?: boolean = true;
  @Input() eventDate?: Date;
  @Input() eventTime?: Date;

  faArrowLeft = faArrowLeft;
  faBatteryEmpty = faBatteryEmpty;
  faStar = faStar;
  faPeopleArrows = faPeopleArrows;
  faFaceSmile = faFaceSmile;
  faTrash = faTrash;

  cartTotal: number = 0;
  foodOrder: FoodOrder;
  partyOrder: FoodOrder;
  kitchen: CloudKitchen;
  price: number = 0.00;
  panels = ['Your Order', 'Second', 'Third'];

  constructor(
    private _location: Location,
    private orderService: FoodOrderService,
    private cloudKitchenService: CloudKitchenService) {
  }

  ngOnInit(): void {
    // this.orderService.getData();
    this.loadFoodOrder();
    this.loadPartyOrder();
    this.kitchen = this.cloudKitchenService.getData();
  }

  private loadFoodOrder() {
    this.orderService.foodOrderSubject$.subscribe({
      next: (value) => {
        console.log('FoodOrder rx emitted a notification. ' + JSON.stringify(value))
        this.foodOrder = value;
        if (this.foodOrder) {
          this.cartTotal = this.cartTotal + this.foodOrder.total;
          this.cartTotal = +(+this.cartTotal).toFixed(2);
        }
      },
      error: (err) => console.error('FoodOrder emitted an error: ' + err),
      complete: () => console.log('FoodOrder emitted the complete notification'),
    });
  }

  private loadPartyOrder() {
    this.orderService.partyOrderSubject$.subscribe({
      next: (value) => {
        console.log('PartyOrder rx emitted a notification. ' + JSON.stringify(value))
        this.partyOrder = value;
        if (this.partyOrder) {
          this.cartTotal = this.cartTotal + this.partyOrder.total;
          this.cartTotal = +(+this.cartTotal).toFixed(2);
        }
      },
      error: (err) => console.error('PartyOrder emitted an error: ' + err),
      complete: () => console.log('PartyOrder emitted the complete notification'),
    });
  }

  getAddress(): string {
    var address: string = ""
    if (this.kitchen !== null && this.kitchen !== undefined) {
      return Utils.getCloudKitchenAddress(this.kitchen);
    }
    return address;
  }

  goback() {
    this._location.back();
  }


  deleteOrder(order: FoodOrder) {
    if ( order.partyOrder){
      this.orderService.destroyPartyOrder();
    }else{
      this.orderService.destroyFoodOrder();
    }
  }

}

