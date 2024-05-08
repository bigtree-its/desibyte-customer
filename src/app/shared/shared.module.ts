import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './pages/header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './pages/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthModule } from '../auth';
import { ReviewItemComponent } from './pages/review-item/review-item.component';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentFormComponent } from './pages/payment-form/payment-form.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: '', component: HomeComponent }
]

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ReviewItemComponent,
    PaymentFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DateAgoPipe,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    NgbDropdownModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    HeaderComponent,
    PaymentFormComponent,
    ReviewItemComponent
  ]
})
export class SharedModule {
}
