import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './pages/header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReviewItemComponent } from './pages/review-item/review-item.component';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentFormComponent } from './pages/payment-form/payment-form.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PostcodeLookupComponent } from './pages/postcode-lookup/postcode-lookup.component';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import { FooterComponent } from './pages/footer/footer.component';
import { SandboxComponent } from './pages/sandbox/sandbox.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sandbox', component: SandboxComponent }
]

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    ReviewItemComponent,
    PaymentFormComponent,
    PostcodeLookupComponent,
    FooterComponent,
    SandboxComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DateAgoPipe,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    NgbDropdownModule,
    ImagekitioAngularModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    PostcodeLookupComponent,
    PaymentFormComponent,
    ReviewItemComponent
  ]
})
export class SharedModule {
}
