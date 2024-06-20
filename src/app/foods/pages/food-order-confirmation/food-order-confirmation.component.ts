import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodOrder, CloudKitchen, CloudKitchenMini, OrderUpdateRequest } from 'src/app/model/all-foods';
import { Utils } from 'src/app/services/common/utils';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';

@Component({
  selector: 'app-food-order-confirmation',
  templateUrl: './food-order-confirmation.component.html',
  styleUrls: ['./food-order-confirmation.component.css']
})
export class FoodOrderConfirmationComponent {

  cartTotal: number = 0;
  order: FoodOrder;
  cloudKitchen: CloudKitchen;
  price: number = 0.0;
  redirectStatus: any;

  activatedRoute=inject(ActivatedRoute);
  orderService=inject(FoodOrderService);
  cloudKitchenMini: CloudKitchenMini;
  error: boolean;
  loading: boolean;

  ngOnInit() {
    this.loading = true;
    this.redirectStatus = this.activatedRoute.snapshot.queryParamMap.get('redirect_status');
    const paymentIntent = this.activatedRoute.snapshot.queryParamMap.get('payment_intent');
    var obj : OrderUpdateRequest = {
      "paymentIntentId": paymentIntent,
      "paymentStatus": this.redirectStatus
    }
    this.orderService.updateOrder(obj ).subscribe((o) => {
      this.order = o;
      if (Utils.isValid(this.order)) {
        this.loading = false;
        console.log('Retrieved order from server ['+ this.order.reference+", Status = "+ this.order.status+"]")
        this.cloudKitchenMini = this.order.cloudKitchen;
        if (this.redirectStatus === 'succeeded') {
          this.orderService.destroy();
        }
      } else {
        console.log('Order not found');
        this.error = true;
      }
    });
    
  }
}
