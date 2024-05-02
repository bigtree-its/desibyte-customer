import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SideNavComponent } from './shared/pages/side-nav/side-nav.component';
import { SideNavContentComponent } from './shared/pages/side-nav-content/side-nav-content.component';
import { AuthModule } from './auth';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { CustomDateParserFormatter } from './services/common/CustomDateParserFormatter';
import { FoodsModule } from './foods';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    SideNavContentComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FoodsModule,
    AuthModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },],
  bootstrap: [AppComponent]
})
export class AppModule { }
