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
import { AdminModule } from './admin';
import { DecimalPipe } from '@angular/common';
import { AdsModule } from './ads/ads.module';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import { environment } from 'src/environments/environment';

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
    AdminModule,
    AuthModule,
    AdsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    ImagekitioAngularModule.forRoot({
      publicKey: environment.ImageKitPublicKey,
      urlEndpoint: environment.ImageKitUrlEndpoint,
    })
  ],
  providers: [ 
    DecimalPipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },],
  bootstrap: [AppComponent]
})
export class AppModule { }
