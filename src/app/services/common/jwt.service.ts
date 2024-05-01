import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalService } from "./local.service";

@Injectable({ providedIn: "root" })
export class JwtService {

  private idToken: string = "idToken"
  private accessToken: string = "accessToken"
  jwtHelper = new JwtHelperService();

  constructor(private localService: LocalService) { }

  getIdToken(): string {
    return this.localService.getData(this.idToken);
  }

  getAccessToken(): string {
    return this.localService.getData(this.accessToken);
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  saveIdToken(token: string): void {
    this.localService.saveData(this.idToken, token)
  }

  saveAccessToken(token: string): void {
    this.localService.saveData(this.accessToken, token)
  }

  destroyToken(): void {
    this.localService.removeData(this.idToken)
    this.localService.removeData(this.accessToken)
  }

  validateToken(token) {
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      return false;
    } else {
      return true;
    }
  }
}