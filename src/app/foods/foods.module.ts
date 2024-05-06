import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodsHomeComponent } from './pages/foods-home/foods-home.component';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChefListComponent } from './pages/chef-list/chef-list.component';
import { ChefHomeComponent } from './pages/chef-home/chef-home.component';
import { FoodItemComponent } from './pages/food-item/food-item.component';
import { FoodBasketComponent } from './pages/food-basket/food-basket.component';
import { FoodCheckoutComponent } from './pages/food-checkout/food-checkout.component';
import { FoodOrderConfirmationComponent } from './pages/food-order-confirmation/food-order-confirmation.component';
import { SharedModule } from '../shared';
import { DateCalcPipe } from '../pipes/date-calc.pipe';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FOrderItemComponent } from './pages/f-order-item/f-order-item.component';

const routes: Routes = [
  { path: 'f/home', component: FoodsHomeComponent },
  { path: 'f/area/:area', component: ChefListComponent },
  { path: 'f/chef/:id', component: ChefHomeComponent },
  { path: 'f/basket', component: FoodBasketComponent },
  { path: 'f/checkout', component: FoodCheckoutComponent },
  { path: 'f/confirmation', component: FoodOrderConfirmationComponent },
]

@NgModule({
  declarations: [
    FoodsHomeComponent,
    ChefListComponent,
    ChefHomeComponent,
    FoodBasketComponent,
    FoodItemComponent,
    FoodCheckoutComponent,
    FoodOrderConfirmationComponent,
    FOrderItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    DateAgoPipe,
    DateCalcPipe,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ]
})
export class FoodsModule { }
