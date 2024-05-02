import { Component, Input } from '@angular/core';
import { FoodOrderItem, PartyOrderItem } from 'src/app/model/all-foods';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';

@Component({
  selector: 'app-f-order-item',
  templateUrl: './f-order-item.component.html',
  styleUrls: ['./f-order-item.component.css']
})
export class FOrderItemComponent {

  @Input() item: FoodOrderItem;
  @Input() partyItem: PartyOrderItem;
  @Input() priceMode: String;
  @Input() editable: boolean = true;
  @Input() displayImage: boolean = true;
  @Input() displayDeleteOption: boolean = false;

  quantity: number = 1;
  price: number = 0.00;

  constructor(private orderService: FoodOrderService) { }

  ngOnInit(): void {
    if ( this.partyItem){
      this.price = this.partyItem.price;
      this.quantity = this.partyItem.quantity;
    }else{
      this.price = this.item.price;
      this.quantity = this.item.quantity;
    }
    
  }

  increaseQuantity() {
    if (this.quantity < 10) {
      this.quantity = this.quantity + 1;
      this.calculatePrice();
    }
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity = this.quantity - 1;
      this.calculatePrice();
    }
  }

  private calculatePrice() {
    if ( this.quantity === 0){
      if ( this.partyItem){
        this.orderService.removePartyItem(this.partyItem);
      }else{
        this.orderService.removeItem(this.item);
      }
    }else{
      if (this.partyItem){
        this.partyItem.subTotal = this.partyItem.price * this.quantity;
        this.partyItem.subTotal = +(+this.partyItem.subTotal).toFixed(2);
        this.partyItem.quantity = this.quantity;
        this.orderService.updatePartyItem(this.partyItem);
      }else{
        this.item.subTotal = this.item.price * this.quantity;
        this.item.subTotal = +(+this.item.subTotal).toFixed(2);
        this.item.quantity = this.quantity;
        this.orderService.updateItem(this.item);
      }
      
    }
    
  }

}
