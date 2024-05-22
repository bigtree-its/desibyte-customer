import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { BecomeAPartnerComponent } from './pages/become-a-partner/become-a-partner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ManageOrderComponent } from './pages/manage-order/manage-order.component';
import { SharedModule } from '../shared';
import { OrderByDatePipe } from '../pipes/order-by-date.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyAdsComponent } from './pages/my-ads/my-ads.component';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { AuthGuard } from '../services/auth/auth-guard.service';
import { MyMessagesComponent } from './pages/my-messages/my-messages.component';

const routes: Routes = [
  {
    path: 'my_orders', component: MyOrdersComponent, loadChildren: () =>
      import('./admin.module').then((m) => m.AdminModule),canActivate: [AuthGuard]
  },
  {
    path: 'my_ads', component: MyAdsComponent, loadChildren: () =>
      import('./admin.module').then((m) => m.AdminModule),canActivate: [AuthGuard]
  },
  {
    path: 'my_orders/manage', component: ManageOrderComponent, loadChildren: () =>
      import('./admin.module').then((m) => m.AdminModule),canActivate: [AuthGuard]
  },
  {
    path: 'my_profile', component: MyProfileComponent, loadChildren: () =>
      import('./admin.module').then((m) => m.AdminModule), canActivate: [AuthGuard]
  },
  {
    path: 'contact_us', component: BecomeAPartnerComponent, loadChildren: () =>
      import('./admin.module').then((m) => m.AdminModule),
  }
]


@NgModule({
  declarations: [
    MyOrdersComponent,
    MyProfileComponent,
    BecomeAPartnerComponent,
    OrderByDatePipe,
    ManageOrderComponent,
    MyAdsComponent,
    MyMessagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    NgbModule,
    DateAgoPipe,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
