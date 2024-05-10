import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostAdComponent } from './pages/post-ad/post-ad.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared';
import { HomeComponent } from './pages/home/home.component';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';

const routes: Routes = [
  { path: 'ads/post', component: PostAdComponent },
  { path: 'ads/home', component: HomeComponent },
  { path: 'ads/p/:id', component: PropertyDetailComponent }
]

@NgModule({
  declarations: [
    PostAdComponent,
    HomeComponent,
    PropertyDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    FontAwesomeModule,
    NgbCarouselModule,
    DateAgoPipe,
    RouterModule.forChild(routes)
  ]
})
export class AdsModule { }
