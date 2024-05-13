import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APITierResponse } from 'src/app/model/all-address-lookup';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiTierService {

  private APITier_Url = environment.API_Tier_Postcode;
  private APITier_Key = environment.API_Tier_PRIVATE_KEY;


  constructor(
    private http: HttpClient
  ) { }

  lookupAddresses(postcode: string): Observable<APITierResponse> {
    console.log('Fetching addresses for the postcode : ', postcode);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('Access-Control-Allow-Origin', '*');

    var params = new HttpParams();
    params = params.set('x-api-key', this.APITier_Key);

    return this.http.get<APITierResponse>(this.APITier_Url +postcode, { headers: headers, params: params }) as Observable<APITierResponse>;
  }
}
