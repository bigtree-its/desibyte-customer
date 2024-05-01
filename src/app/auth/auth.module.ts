import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent, RegisterComponent, ResetInitiateComponent, ResetSubmitComponent } from './pages';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'password_reset/new', component: ResetInitiateComponent },
  { path: 'password_reset/submit', component: ResetSubmitComponent }
]

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResetInitiateComponent,
    ResetSubmitComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule {
  constructor() {
    
  }
 }
