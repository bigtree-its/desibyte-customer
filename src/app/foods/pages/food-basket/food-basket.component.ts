import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft, faBatteryEmpty, faFaceSmile, faPeopleArrows, faStar } from '@fortawesome/free-solid-svg-icons';
import { FoodOrder, LocalChef } from 'src/app/model/all-foods';
import { Utils } from 'src/app/services/common/utils';
import { ChefService } from 'src/app/services/foods/chef.service';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';



@Component({
  selector: 'app-basket',
  templateUrl: './food-basket.component.html',
  styleUrls: ['./food-basket.component.css']
})
export class FoodBasketComponent {

  faArrowLeft = faArrowLeft;
  faBatteryEmpty = faBatteryEmpty;
  faStar = faStar;
  faPeopleArrows = faPeopleArrows;
  faFaceSmile = faFaceSmile;

  cartTotal: number = 0;
  order: FoodOrder;
  chef: LocalChef;
  price: number = 0.00;
  panels = ['Your Order', 'Second', 'Third'];

  constructor(
    private _location: Location,
    private orderService: FoodOrderService,
    private chefService: ChefService,
    private router: Router){
  }

  ngOnInit(): void{

    this.orderService.getData();
    this.orderService.orderSubject$.subscribe({
      next: (value) => {
        var FoodOrder: FoodOrder = value;
        this.extractData(FoodOrder);
      },
      error: (err) => console.error('OrderSubject emitted an error: ' + err),
      complete: () =>
        console.log('OrderSubject emitted the complete notification'),
    });
    
    this.chef = this.chefService.getData();
  }

  extractData(theOrder: FoodOrder) {
    if ( Utils.isValid(theOrder) && theOrder.status === "Completed"){
      return;
    }
    this.order = theOrder;
    if (theOrder !== null && theOrder !== undefined){
      console.log('The order: '+ JSON.stringify(theOrder))
      this.cartTotal = theOrder.subTotal;
      if ( theOrder.items === null || theOrder.items === undefined || theOrder.items.length === 0){
        if ( this.chef !== null && this.chef !== undefined){
          this.router.navigate([ 'cooks', this.chef._id]).then();
        }
      }
    }else{
      this.cartTotal = 0;
    }
  }

  getAddress(): string {
    var address: string = ""
    if ( this.chef !== null && this.chef !== undefined){
      return Utils.getChefAddress(this.chef);
    }
    return address;
  }


  getOrder(): FoodOrder{
    var orderJson = localStorage.getItem('order');
    var order: FoodOrder = null;
    if ( orderJson !== null && orderJson !== undefined){
      order = JSON.parse(orderJson);
    }
    return order;
  }

  goback(){
    this._location.back();
  }

  getChef(): LocalChef{
    var chefJson = localStorage.getItem('chef');
    var chef: LocalChef = null;
    if ( chefJson !== null && chefJson !== undefined){
      chef = JSON.parse(chefJson);
    }
    return chef;
  }
}

