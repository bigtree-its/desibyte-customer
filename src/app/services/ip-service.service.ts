import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpServiceService {

  httpClient = inject(HttpClient);

  constructor() { }

  public getIPAddress()  
  {  
    return this.httpClient.get("http://api.ipify.org/?format=json");  
  }  
}
