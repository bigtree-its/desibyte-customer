import { DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faArrowLeft, faChevronDown, faChevronUp, faEye, faFaceSmile, faPeopleArrows, faStar } from '@fortawesome/free-solid-svg-icons';
import { map, Observable, startWith, Subject } from 'rxjs';
import { AdSearchQuery, GeneralAd } from 'src/app/model/all-ads';
import { User } from 'src/app/model/all-auth';
import { AdsService } from 'src/app/services/ads/ads.service';
import { AccountService } from 'src/app/services/auth/account.service';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.component.html',
  styleUrls: ['./my-ads.component.css'],
})
export class MyAdsComponent implements OnInit, OnDestroy {
  adService = inject(AdsService);
  accountService = inject(AccountService);

  destroy$ = new Subject<void>();
  user: User;
  ads: GeneralAd[] = [];
  myAds$: Observable<GeneralAd[]>;
  filter = new FormControl('', { nonNullable: true });

  decimalPipe = inject(DecimalPipe);
  viewAd: GeneralAd;

  faArrowLeft = faArrowLeft;
  faStar = faStar;
  faPeopleArrows = faPeopleArrows;
  faFaceSmile = faFaceSmile;
  chevronDown = faChevronDown;
  chevronUp = faChevronUp;
  faEye=faEye;
  
  loading: boolean = false;

  ngOnInit(): void {
    this.accountService.getData();
    this.accountService.loginSession$.subscribe({
      next: (value) => {
        this.user = value;
        console.log('CustomerObject. emitted ' + JSON.stringify(value));
        this.fetchMyAds();
      },
      error: (err) => console.error('CustomerObject emitted an error: ' + err),
      complete: () =>
        console.log('CustomerObject emitted the complete notification'),
    });
  }

  fetchMyAds() {
    var query: AdSearchQuery = {};
    query.adOwner = this.user.email;

    let observable = this.adService.getAds(query);
      observable.subscribe((e) => {
        if (Utils.isValid(e)) {
          const sortedArray = e
            .slice()
            .sort((a, b) => {
              return <any>new Date(b.datePosted) - <any>new Date(a.datePosted);
            });
          this.ads = sortedArray;
          this.myAds$ = this.filter.valueChanges.pipe(
            startWith(''),
            map((text) => this.search(text, this.decimalPipe))
          );
        }
      });
  }

  search(text: string, pipe: PipeTransform): GeneralAd[] {
    return this.ads?.filter((ad) => {
      const term = text.toLowerCase();
      return (
        ad.reference.toLowerCase().includes(term) ||
        pipe.transform(ad.status).includes(term) ||
        pipe.transform(ad.price).includes(term)
      );
    });
  }

  open(ad: GeneralAd) {
    this.viewAd = ad;
  }

  goBack() {
    this.viewAd = null;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
