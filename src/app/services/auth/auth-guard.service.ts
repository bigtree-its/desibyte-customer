import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn,
} from '@angular/router';
import { AccountService } from './account.service';
import { JwtService } from '../common/jwt.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const loginService = inject(AccountService);
  const router = inject(Router);
  const jwtService = inject(JwtService);
  // Store the attempted URL for redirecting
  loginService.redirectUrl = state.url;
  var s = jwtService.getAccessToken();
  var found = s !== null && s !== undefined && jwtService.validateToken(s);
  if (found) {
    if (jwtService.isSupplier(null)) {
      console.log('User logged in as supplier');
    } else if (jwtService.isAdmin(null)) {
      console.log('User logged in as admin');
    } else {
      console.log('User logged in as customer');
    }
    return true;
  } else {
    console.log('User not logged in. redirecting to Login');
    // Store the attempted URL for redirecting
    loginService.redirectUrl = state.url;
    router.navigate(['/login']);
    return false;
  }
};

export const IsLoggedIn = (url: string) => {
  const loginService = inject(AccountService);
  const router = inject(Router);
  let observabl = loginService.isAuthenticated();
  if (loginService.isAuthenticated()) {
    return true;
  }

  console.log('User not logged in. redirecting to Login');
  // Store the attempted URL for redirecting
  loginService.redirectUrl = url;

  // Navigate to the login page with extras
  router.navigate(['/login']);
  return false;
};
