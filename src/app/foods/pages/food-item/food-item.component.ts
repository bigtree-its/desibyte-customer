import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faCheck,
  faCircle,
  faCircleCheck,
  faMinus,
  faPepperHot,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Extra, Food, FoodOrderItem, Menu, PartyBundle, PartyBundleCandidate, PartyOrderItem } from 'src/app/model/all-foods';
import { BasketService } from 'src/app/services/common/basket.service';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css'],
})
export class FoodItemComponent {

  @Input() menu?: Menu;
  @Input() displayOrderBy?: Boolean = false;
  @Input() displayDescription?: Boolean = false;
  @Input() orderBy?: Date;
  @Input() readyBy?: Date;
  @Input() pb?: PartyBundle;

  price: number = 0.0;
  specialInstruction: string | undefined;
  selectedchoice?: Extra;
  selectedExtras: Extra[] = [];
  quantity: number = 1;
  orderByDate: Date;

  faCheck = faCheck;
  faPlus = faPlus;
  faMinus = faMinus;
  faPepperHot = faPepperHot;
  faCircle = faCircle;
  candidates: PartyBundleCandidate[] = [];

  constructor(
    private basketService: BasketService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    if (this.menu) {
      this.price = this.menu.price;
    } else if (this.pb) {
      this.price = this.pb.price;
    }

    if (this.readyBy) {
      var date = new Date(this.readyBy);
      this.orderBy = new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000);
    }
  }

  addDays(theDate: Date, days: number): Date {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  open(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'custom-class',
      })
      .result.then(
        (result) => { },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  close() {
    this.modalService.dismissAll();
  }

  selectItemOnCandidate(candidate: PartyBundleCandidate, food: Food, e: any) {
    if (this.pb !== null && this.pb !== undefined) {
      var candis: PartyBundleCandidate[] = this.pb.partyBundleCandidates.filter(c => c.name === candidate.name);
      var theCandidate = candis[0];
      // When User selected a food item
      if (e.target.checked) {
        var candiOnSelectedCandis: PartyBundleCandidate[] = this.candidates.filter(c => c.name === candidate.name);
        var theSelectedCandidate = candiOnSelectedCandis[0];
        if ( theSelectedCandidate){
          if (theSelectedCandidate.items.length === theSelectedCandidate.max) {
            e.target.checked = false;
            return;
          }else{
            console.log('Pushing item to ' + theSelectedCandidate.name );
            theSelectedCandidate.items.push(food);
          }
        }else{
          // The candidate never been selected
          var c1: PartyBundleCandidate = {
            name: theCandidate.name,
            required: theCandidate.required,
            max: theCandidate.max,
            items: []
          }
          c1.items.push(food);
          this.candidates.push(c1);
        }
      } else {
         // When User un-selected a food item
         console.log('User unselected  '+ food.name);
        var candiOnSelectedCandis: PartyBundleCandidate[] = this.candidates.filter(c => c.name === candidate.name);
        var theSelectedCandidate = candiOnSelectedCandis[0];
        if ( theSelectedCandidate){
          for (var i = 0; i <  theSelectedCandidate.items.length; i++) {
            var foodOn = theSelectedCandidate.items[i];
            if (foodOn.name === food.name) {
              theSelectedCandidate.items.splice(i, 1);
            }
          }
        }
      }
    }
  }

  getRequiredText(_t88: PartyBundleCandidate) {
    if ( this.candidates.length > 0){
      var candidate = null;
      for (var i = 0; i <  this.candidates.length; i++) {
        var c = this.candidates[i];
        if (c.name === _t88.name) {
          candidate = c;
          break;
        }
      }
      if ( candidate){
        return candidate.items.length === 0? "Required": candidate.items.length < candidate.max? candidate.max - candidate.items.length + " more": "All Set"; 
      }
      
    }
    return _t88.required? "Required": "Optional";
  }

  handleChoiceSelection(e: any) {
    if (this.menu !== null && this.menu !== undefined) {
      this.menu.choices.forEach((choice) => {
        if (choice.name === e.target.value) {
          if (
            this.selectedchoice === null ||
            this.selectedchoice === undefined
          ) {
            this.selectedchoice = choice;
            this.price = this.price + this.selectedchoice.price * this.quantity;
            this.price = +(+this.price).toFixed(2);
          } else {
            // Remore Previously Added Choice
            this.price = this.price - this.selectedchoice.price * this.quantity;
            this.price = +(+this.price).toFixed(2);
            // Add New Choice
            this.selectedchoice = choice;
            this.price = this.price + this.selectedchoice.price * this.quantity;
            this.price = +(+this.price).toFixed(2);
          }
        }
      });
    }
  }

  selectExtra(extraClicked: string, e: any) {
    if (this.menu !== null && this.menu !== undefined) {
      this.menu.extras.forEach((item) => {
        if (item.name === extraClicked) {
          if (e.target.checked) {
            this.selectedExtras.push(item);
            this.price = this.price + item.price * this.quantity;
            this.price = +(+this.price).toFixed(2);
          } else {
            for (var i = 0; i < this.selectedExtras.length; i++) {
              var ex = this.selectedExtras[i];
              if (ex.name === extraClicked) {
                this.selectedExtras.splice(i, 1);
                this.price = this.price - ex.price * this.quantity;
                this.price = +(+this.price).toFixed(2);
              }
            }
          }
        }
      });
    }
  }
  increaseQuantity() {
    if (this.quantity < 10) {
      this.quantity = this.quantity + 1;
      this.calculatePrice();
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity = this.quantity - 1;
      this.calculatePrice();
    }
  }

  private calculatePrice() {
    var extraTotal = 0;
    for (var i = 0; i < this.selectedExtras.length; i++) {
      extraTotal = extraTotal + this.selectedExtras[i].price;
    }
    if (this.selectedchoice !== null && this.selectedchoice !== undefined) {
      extraTotal = extraTotal + this.selectedchoice.price;
    }
    if ( this.pb){
      this.price = (this.pb.price + extraTotal) * this.quantity;
      this.price = +(+this.price).toFixed(2);
    }
    if (this.menu){
      this.price = (this.menu.price + extraTotal) * this.quantity;
      this.price = +(+this.price).toFixed(2);
    }
  }

  addToOrder() {
    console.log('Add to Order: ');
    if ( this.pb){
      var partyItem: PartyOrderItem = {
        _tempId: Date.now(),
        id: this.pb._id,
        image: this.pb.image,
        name: this.pb.name,
        quantity: this.quantity,
        price: this.pb.price,
        subTotal: this.price,
        extras: this.selectedExtras,
        candidates: this.candidates,
        specialInstruction: this.specialInstruction,
      };
      this.basketService.addPartyItem(partyItem);
    }else{
      var foodOrderItem: FoodOrderItem = {
        _tempId: Date.now(),
        id: this.menu._id,
        image: this.menu.image,
        name: this.menu.name,
        quantity: this.quantity,
        price: this.menu.price,
        subTotal: this.price,
        extras: this.selectedExtras,
        choice: this.selectedchoice,
        specialInstruction: this.specialInstruction,
      };
      this.basketService.addToFoodOrder(foodOrderItem);
    }
   
    this.close();
  }
}
