import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostAdComponent } from './pages/post-ad/post-ad.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared';

const routes: Routes = [
  { path: 'ads/post', component: PostAdComponent }
]

@NgModule({
  declarations: [
    PostAdComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ]
})
export class AdsModule { }
