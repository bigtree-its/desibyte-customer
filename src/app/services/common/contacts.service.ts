import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ServiceLocator } from "./service.locator";
import { Contacts } from "src/app/model/common";

@Injectable({
    providedIn: 'root',
  })
  export class ContactsService {

    private http = inject(HttpClient);
    private serviceLocator = inject(ServiceLocator);

    public createContact(c: Contacts): Observable<Contacts>{
        return this.http.post<Contacts>(this.serviceLocator.CreateContactsUrl, c);
    }

  }