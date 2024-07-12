import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent, RegisterComponent, ResetInitiateComponent, ResetSubmitComponent } from './pages';
import { AccountActivateComponent } from './pages/account-activate/account-activate.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'password_reset/new', component: ResetInitiateComponent },
  { path: 'password_reset/submit', component: ResetSubmitComponent },
  { path: 'account_activate', component: AccountActivateComponent }
]

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResetInitiateComponent,
    ResetSubmitComponent,
    AccountActivateComponent
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
