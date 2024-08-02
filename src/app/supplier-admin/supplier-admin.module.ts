import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { MySettingsComponent } from './pages/my-settings/my-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { MyHomeComponent } from './pages';
import { SharedModule } from '../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupplierGuard } from '../services/auth/supplier-guard.service';
import { KitchenMenuComponent } from './pages/kitchen-menu/kitchen-menu.component';

const routes: Routes = [
  {
    path: 'kitchen/home',
    component: MyHomeComponent,
    canActivate: [SupplierGuard],
  },
  {
    path: 'kitchen/orders',
    component: MyOrdersComponent,
    canActivate: [SupplierGuard],
  },
  {
    path: 'kitchen/menus',
    component: KitchenMenuComponent,
    canActivate: [SupplierGuard],
  },
  {
    path: 'kitchen/products',
    component: KitchenMenuComponent,
    canActivate: [SupplierGuard],
  },
  {
    path: 'kitchen/settings',
    component: MySettingsComponent,
    canActivate: [SupplierGuard],
  },
];

@NgModule({
  declarations: [
    MyHomeComponent,
    MyProductsComponent,
    MyOrdersComponent,
    MySettingsComponent,
    KitchenMenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ImagekitioAngularModule,
    NgbDropdownModule,
    FontAwesomeModule,
    NgbDatepickerModule,
    NgbModule,
    RouterModule.forChild(routes),
  ],
})
export class SupplierAdminModule {}
