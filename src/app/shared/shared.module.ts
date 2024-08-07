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
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostcodeLookupComponent } from './pages/postcode-lookup/postcode-lookup.component';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import { FooterComponent } from './pages/footer/footer.component';
import { SandboxComponent } from './pages/sandbox/sandbox.component';
import { WriteReviewComponent } from './pages/write-review/write-review.component';
import { AuthGuard } from '../services/auth/auth-guard.service';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';
import { RatingComponent } from './pages/rating/rating.component';
import { OrderProgressComponent } from './pages/order-progress/order-progress.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './pages/cookie-policy/cookie-policy.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'write_review', component: WriteReviewComponent, canActivate: [AuthGuard] },
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
    SandboxComponent,
    WriteReviewComponent,
    RatingComponent,
    OrderProgressComponent,
    PrivacyPolicyComponent,
    CookiePolicyComponent,
    TermsAndConditionsComponent
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
    DragScrollComponent,
    DragScrollItemDirective,
    RouterModule.forChild(routes)
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    PostcodeLookupComponent,
    PaymentFormComponent,
    ReviewItemComponent,
    RatingComponent,
    OrderProgressComponent,
    NgbModule
  ]
})
export class SharedModule {
}
