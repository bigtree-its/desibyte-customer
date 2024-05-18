import { DecimalPipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PipeTransform,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  faArrowLeft,
  faChevronDown,
  faChevronUp,
  faEnvelope,
  faEye,
  faFaceSmile,
  faPeopleArrows,
  faRectangleAd,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { map, Observable, startWith, Subject } from 'rxjs';
import {
  AdEnquiry,
  AdSearchQuery,
  GeneralAd,
  PropertyAd,
  PropertySearchQuery,
} from 'src/app/model/all-ads';
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
  myPropertyAds$: Observable<PropertyAd[]>;
  adFilter = new FormControl('', { nonNullable: true });
  propertyFilter = new FormControl('', { nonNullable: true });

  decimalPipe = inject(DecimalPipe);
  viewAd: GeneralAd;

  faArrowLeft = faArrowLeft;
  faStar = faStar;
  faPeopleArrows = faPeopleArrows;
  faFaceSmile = faFaceSmile;
  chevronDown = faChevronDown;
  chevronUp = faChevronUp;
  faEye = faEye;
  faEnvelop = faEnvelope;
  faAd = faRectangleAd;

  selectedTab: string;
  selectedAdTab: string;

  loading: boolean = false;
  properties: PropertyAd[] = [];
  viewProperty: PropertyAd;
  enquiries: AdEnquiry[] = [];
  viewEnquiries: boolean;
  enquiry: AdEnquiry;

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
    this.selectedTab = 'Ads';
  }

  fetchMyAds() {
    var query: AdSearchQuery = {};
    query.adOwner = this.user.email;

    let observable = this.adService.getAds(query);
    observable.subscribe((e) => {
      if (Utils.isValid(e)) {
        const sortedArray = e.slice().sort((a, b) => {
          return <any>new Date(b.datePosted) - <any>new Date(a.datePosted);
        });
        this.ads = sortedArray;
        this.myAds$ = this.adFilter.valueChanges.pipe(
          startWith(''),
          map((text) => this.searchAd(text, this.decimalPipe))
        );
      }
    });

    var pQuery: PropertySearchQuery = {};
    pQuery.adOwner = this.user.email;
    let pO = this.adService.getProperties(pQuery);
    pO.subscribe((e) => {
      if (Utils.isValid(e)) {
        const sortedArray = e.slice().sort((a, b) => {
          return <any>new Date(b.datePosted) - <any>new Date(a.datePosted);
        });
        this.properties = sortedArray;
        console.log('retrieved properties ' + JSON.stringify(this.properties));
        this.myPropertyAds$ = this.propertyFilter.valueChanges.pipe(
          startWith(''),
          map((text) => this.searchPropertyAd(text, this.decimalPipe))
        );
      }
    });
  }

  goHome() {
    this.viewAd = null;
    this.viewProperty = null;
  }

  selectTab(t: string) {
    this.selectedTab = t;
  }

  selectAdTab(t: string) {
    this.selectedAdTab = t;
  }

  searchAd(text: string, pipe: PipeTransform): GeneralAd[] {
    return this.ads?.filter((ad) => {
      const term = text.toLowerCase();
      return (
        ad.reference.toLowerCase().includes(term) ||
        pipe.transform(ad.status).includes(term) ||
        pipe.transform(ad.price).includes(term)
      );
    });
  }

  searchPropertyAd(text: string, pipe: PipeTransform): PropertyAd[] {
    return this.properties?.filter((property) => {
      const term = text.toLowerCase();
      return (
        property.reference.toLowerCase().includes(term) ||
        pipe.transform(property.status).includes(term) ||
        pipe.transform(property.price).includes(term)
      );
    });
  }

  open(ad: GeneralAd) {
    this.viewAd = ad;
    this.retrieveEnquiries(ad.reference, ad.category);
    this.viewProperty = null;
    this.selectedAdTab = 'AdDetailTab';
  }

  private retrieveEnquiries(reference: string, category: string) {
    this.enquiries = null;
    let oEnq = this.adService.getEnquiries(reference, category);
    oEnq.subscribe((e) => {
      if (Utils.isValid(e)) {
        const sortedArray = e.slice().sort((a, b) => {
          return <any>new Date(b.date) - <any>new Date(a.date);
        });
        this.enquiries = sortedArray;
        console.log('retrieved enquiries ' + JSON.stringify(this.enquiries));
      }
    });
  }

  openProperty(p: PropertyAd) {
    this.viewProperty = p;
    this.viewAd = null;
    this.retrieveEnquiries(p.reference, 'Property');
    this.selectedAdTab = 'AdDetailTab';
  }

  goBack() {
    this.viewAd = null;
    this.viewProperty = null;
  }

  showEnquiries() {
    this.viewEnquiries = true;
  }

  selectEnquiry(_t106: AdEnquiry) {
    this.enquiry = _t106;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
