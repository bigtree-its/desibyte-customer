import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RapidApiByPostcodeResponse } from 'src/app/model/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapidApiService {

  private X_RapidAPI_Url = environment.X_RapidAPI_Url;
  private X_RapidAPI_Key = environment.X_RapidAPI_Key;
  private X_RapidAPI_Host = environment.X_RapidAPI_Host;


  constructor(
    private http: HttpClient
  ) { }

  lookupAddresses(postcode: string): Observable<RapidApiByPostcodeResponse> {
    console.log('Fetching addresses for the postcode : ', postcode);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    headers = headers.append('x-rapidapi-key', this.X_RapidAPI_Key);
    headers = headers.append('x-rapidapi-host', this.X_RapidAPI_Host);
    headers = headers.append('useQueryString', 'true');

    var params = new HttpParams();
    params = params.set('postcode', postcode);

    return this.http.get<RapidApiByPostcodeResponse>(this.X_RapidAPI_Url, { headers: headers, params: params }) as Observable<RapidApiByPostcodeResponse>;
  }
}
