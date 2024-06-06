import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  tap,
} from 'rxjs/operators';

import { Router } from '@angular/router';
import { CustomerPreferences, LoginResponse, PasswordResetInitiate, PasswordResetSubmit, PersonalDetails, RegisterRequest, SignupResponse, User } from 'src/app/model/all-auth';
import { JwtService } from '../common/jwt.service';
import { LocalService } from '../common/local.service';
import { ServiceLocator } from '../common/service.locator';
import { Constants } from '../common/constants';
import { ApiResponse } from 'src/app/model/common';
import { FoodOrderService } from '../foods/food-order.service';


@Injectable({
  providedIn: 'root',
})
export class AccountService {

  public loginSession$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public customerPreferences$: BehaviorSubject<CustomerPreferences> =
    new BehaviorSubject<CustomerPreferences>(null);
  user: User;

  public redirectUrl: string = null;
  customerPreferences: CustomerPreferences;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private localService: LocalService,
    private foodOrderSvc: FoodOrderService,
    private serviceLocator: ServiceLocator,
    private readonly router: Router
  ) { }

  isAuthenticated(): Observable<boolean> {
    console.log('Checking isAuthenticated');
    var s = this.jwtService.getIdToken();
    var found =
      s !== null && s !== undefined && this.jwtService.validateToken(s);
    if (found) {
      var user = this.buildUser(s);
      this.loginSession$.next(user);
    } else {
      console.error('User not authenticated.');
    }
    console.log('User found in storage : ' + found);
    return of(found);
  }

  getCurrentUser(): User {
    var s = this.jwtService.getIdToken();
    if (s !== null && s !== undefined) {
      return this.buildUser(s);
    }
    return null;
  }

  customerLogin(email: string, password: string): Observable<LoginResponse> {
    var req = {
      username: email,
      password: password,
    };
    console.log('Submitting login credentials to server..');
    return this.http
      .post<LoginResponse>(this.serviceLocator.LoginUrl, req)
      .pipe(
        tap((result) => {
          console.log('Login response ' + JSON.stringify(result));
          if (this.redirectUrl) {
            console.log('redirecting to ' + this.redirectUrl);
            this.router.navigateByUrl(this.redirectUrl);
            this.redirectUrl = null;
          } else {
            this.router.navigate(['/']);
          }
          this.setUser(result);

        })
      );
  }

  retrievePreferences(): Observable<CustomerPreferences> {
    console.log('Retrieving CustomerPreferences directly ');
    return this.http.get<CustomerPreferences>("http://localhost:8081/api/customers/65c628d4ecf11762a007f412/preferences");
  }

  public updatePreferences(req: CustomerPreferences): Observable<CustomerPreferences> {
    return this.http.post<CustomerPreferences>(this.serviceLocator.CreateOrUpdateCustomerPreferencesUrl, req, {
      headers: {
        useCustomerToken: 'true'
      },
    });
  }

  public updatePersonal(req: PersonalDetails): Observable<PersonalDetails> {
    return this.http.post<PersonalDetails>(this.serviceLocator.UpdatePersonalDetails, req, {
      headers: {
        useCustomerToken: 'true'
      },
    });
  }


  fetchCustomerPreferences(customerId: string): Observable<CustomerPreferences> {

    var url = this.serviceLocator.GetCustomerPreferencesUrl.replaceAll(
      'replace-me',
      customerId
    );
    console.log('Retrieving CustomerPreferences ' + url);
    return this.http.get<CustomerPreferences>(url, {
      headers: {
        useCustomerToken: 'true'
      },
    }
    ).pipe(
      tap((data) => {
        console.log('Customer preference response ' + JSON.stringify(data))
        this.setCustomerPreferences(data);
      })
    );
  }

  setCustomerPreferences(data: CustomerPreferences) {
    this.localService.saveData(
      Constants.StorageItem_C_Preferences,
      JSON.stringify(data)
    );
    this.customerPreferences = data;
    this.customerPreferences$.next(this.customerPreferences);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    let body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    body.set('grant_type', 'password');
    body.set('client_type', 'Customer');

    console.log('Submitting login credentials to server..');
    return this.http
      .post<LoginResponse>(this.serviceLocator.LoginUrl, body, {
        headers: {
          skip: 'true',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        tap((result) => {
          console.log('Login response ' + JSON.stringify(result));
          if (this.redirectUrl) {
            console.log('redirecting to ' + this.redirectUrl);
            // this.router.navigate([this.redirectUrl]);
            this.router.navigateByUrl(this.redirectUrl);
            this.redirectUrl = null;
          } else {
            this.router.navigate(['/']);
          }
          this.setUser(result);
        })
      );
  }

  register(registerReq: RegisterRequest): Observable<{ signupResponse: SignupResponse }> {
    return this.http
      .post<{ signupResponse: SignupResponse }>(this.serviceLocator.RegisterUrl, registerReq)
      .pipe(
        tap(({ signupResponse }) => {
          // this.setUser(loginResp);
        })
      );
  }

  private setUser(loginResp: LoginResponse) {
    this.jwtService.saveAccessToken(loginResp.accessToken);
    var user: User = this.buildUser(loginResp.accessToken);
    this.localService.saveData(
      Constants.StorageItem_C_User,
      JSON.stringify(user)
    );
    this.user = user;
    // this.fetchCustomerPreferences(user.id);
    this.loginSession$.next(this.user);
    this.foodOrderSvc.retrieveFoodOrders(this.user.email);
  }

  private buildUser(token: string) {
    var tokenClaims = this.jwtService.getDecodedAccessToken(token);
    var user: User = {
      id: tokenClaims.customerId,
      firstName: tokenClaims.firstName,
      lastName: tokenClaims.lastName,
      name: tokenClaims.firstName + ' ' + tokenClaims.lastName,
      email: tokenClaims.sub,
      mobile: tokenClaims.mobile,
      userType: tokenClaims.userType,
    };
    return user;
  }

  public passwordResetInitiate(req: PasswordResetInitiate): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.serviceLocator.PasswordResetInitiateUrl, req);
  }

  public passwordResetSubmit(req: PasswordResetSubmit): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.serviceLocator.PasswordResetSubmitUrl, req);
  }

  public logout() {
    console.log('Logout...');
    this.purgeAuth();
    void this.router.navigate(['/']);
  }

  purgeAuth(): void {
    console.log('Purging all session data...');
    this.jwtService.destroyToken();
    this.loginSession$.next(null);
    this.localService.removeData(Constants.StorageItem_C_User);
    this.localService.removeData(Constants.StorageItem_Product_Order);
    this.localService.removeData(Constants.StorageItem_Food_Order);
    this.localService.removeData(Constants.StorageItem_C_Chef);
  }

  getData() {
    var json = this.localService.getData(Constants.StorageItem_C_User);
    if (json === undefined) {
      return undefined;
    }
    if (json !== '' && json !== null && json !== undefined) {
      var obj = JSON.parse(json);
      this.user = obj.constructor.name === 'Array' ? obj[0] : obj;
      this.loginSession$.next(this.user);
    }
  }

  getCustomerPreferences() {
    var json = this.localService.getData(
      Constants.StorageItem_C_Preferences
    );
    console.log('Customer preferences in storage ' + json)
    if (json === undefined || json === null || json === '') {
      if (this.user !== null && this.user !== undefined) {
        this.fetchCustomerPreferences(this.user.id);
      }
    }
    if (json !== '' && json !== null && json !== undefined) {
      var obj = JSON.parse(json);
      this.customerPreferences =
        obj.constructor.name === 'Array' ? obj[0] : obj;
      this.customerPreferences$.next(this.customerPreferences);
    }
  }
}
