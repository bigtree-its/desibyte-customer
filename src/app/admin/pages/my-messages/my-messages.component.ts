import { Location } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { AdEnquiry } from 'src/app/model/all-ads';
import { User } from 'src/app/model/all-auth';
import { AdsService } from 'src/app/services/ads/ads.service';
import { AccountService } from 'src/app/services/auth/account.service';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.css'],
})
export class MyMessagesComponent implements OnInit, OnDestroy {
  adService = inject(AdsService);
  accountService = inject(AccountService);
  _location = inject(Location);

  destroy$ = new Subject<void>();
  user: User;
  faArrowLeft = faArrowLeft;
  messages: AdEnquiry[] = [];

  ngOnInit(): void {
    this.accountService.getData();
    this.accountService.loginSession$.subscribe({
      next: (value) => {
        this.user = value;
        console.log('CustomerObject. emitted ' + JSON.stringify(value));
        this.fetchMyMessages();
      },
      error: (err) => console.error('CustomerObject emitted an error: ' + err),
      complete: () =>
        console.log('CustomerObject emitted the complete notification'),
    });
  }

  fetchMyMessages() {
    let observable = this.adService.getMyMessages(this.user.email);
    observable.subscribe((e) => {
      if (Utils.isValid(e)) {
        const sortedArray = e.slice().sort((a, b) => {
          return <any>new Date(b.date) - <any>new Date(a.date);
        });
        this.messages = sortedArray;
      }
    });
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
