import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtService } from '../common/jwt.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  jwtService=inject(JwtService);

  constructor() {}

  intercept(req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Auth Interceptor -> '+req.url);
    const skipIntercept = req.headers.has('skip');
    const useCustomerToken = req.headers.has('useCustomerToken');
    if (skipIntercept) {
      console.log('Skipping auth header..')
      req = req.clone({headers: req.headers.delete('skip'),});
      return next.handle(req);
    } else {
      if (useCustomerToken ){
        console.log('Attaching customer token..')
        req = req.clone({headers: req.headers.delete('useCustomerToken'),});
        var customerToken = this.jwtService.getAccessToken();
        if ( customerToken != null && customerToken != undefined){
          const cloned = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + customerToken),
          });
          return next.handle(cloned);
        } else {
          return next.handle(req);
        }
      }else{
        
        const accessToken = environment.CUSTOMER_APP_ACCESS_TOKEN;
        console.log('Attaching browser app token')
        if (accessToken) {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + accessToken),
          });
          return next.handle(cloned);
        } else {
          return next.handle(req);
        }
      }
    }
  }
}
