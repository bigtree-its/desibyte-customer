import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PipeTransform,
} from '@angular/core';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowLeft,
  faChevronDown,
  faChevronUp,
  faEye,
  faFaceSmile,
  faPeopleArrows,
  faRectangleAd,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import {
  AdEnquiry,
  AdEnquiryResponse,
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

  adForm: FormGroup;
  propertyForm: FormGroup;

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
  responseMessage: string;

  loading: boolean = false;
  properties: PropertyAd[] = [];
  viewProperty: PropertyAd;
  enquiries: AdEnquiry[] = [];
  viewEnquiries: boolean;
  enquiry: AdEnquiry;
  editingAd: GeneralAd;
  editingProperty: PropertyAd;
  errorMessage: null;
  updateSuccess: boolean;

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


    this.adForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    this.propertyForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
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

  goBackToEnquiries() {
    this.enquiry = null;
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

  respondToEnquiry() {
    if (Utils.isEmpty(this.responseMessage)) {
      return;
    }
    if (this.enquiry.responses) {
      var resp: AdEnquiryResponse = {};
      resp.date = new Date();
      resp.message = this.responseMessage;
      this.enquiry.responses.push(resp);
      let observable = this.adService.respondEnquiry(this.enquiry);
      observable.pipe(takeUntil(this.destroy$)).subscribe({
        next: (e) => {
          this.responseMessage = null;
        },
        error: (err) => {
          this.loading = false;
          console.error('Errors when posting response' + JSON.stringify(err));
        },
      });
    }
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

  deleteAd(ref: string) {
    let observable = this.adService.deleteAd(ref);
    observable.subscribe((e) => {
      if (Utils.isValid(e)) {
        this.viewAd = null;
      }
    });
  }

  deleteProperty(ref: string) {
    let observable = this.adService.deleteProperty(ref);
    observable.subscribe((e) => {
      if (Utils.isValid(e)) {
        this.viewProperty = null;
      }
    });
  }

  editAd(ad: GeneralAd) {
    this.editingAd = ad;
  }

  editProperty(property: PropertyAd) {
    this.editingProperty = property;
  }

  updateAd() {
    this.errorMessage= null;
    this.updateSuccess = false;
    this.loading = true;
    if (this.adForm.valid) {
      this.viewAd.title = this.adForm.get('title').value,
      this.viewAd.price = this.adForm.get('price').value,
      this.viewAd.description = this.adForm.get('description').value,
      console.log('Updating ad '+ JSON.stringify(this.viewAd))
      this.loading = true;
      var observable = this.adService.updateAd(this.viewAd);
      observable.subscribe(
        (data) => {
          console.warn(JSON.stringify(data, null, 2));
          this.updateSuccess = true;
          this.loading = false;
        },
        (err) => {
          this.updateSuccess = false;
          this.loading = false;
          this.errorMessage = err.error?.detail;
        }
      );
    } else {
      console.log('Form is not valid');
      this.loading = false;
    }
  }

  updateProperty() {
    this.errorMessage= null;
    this.updateSuccess = false;
    this.loading = true;
    if (this.propertyForm.valid) {
      this.viewProperty.title = this.adForm.get('title').value,
      this.viewProperty.price = this.adForm.get('price').value,
      this.viewProperty.description = this.adForm.get('description').value,
      console.log('Updating property '+ JSON.stringify(this.viewProperty))
      this.loading = true;
      var observable = this.adService.updateProperty(this.viewProperty);
      observable.subscribe(
        (data) => {
          console.warn(JSON.stringify(data, null, 2));
          this.updateSuccess = true;
          this.loading = false;
        },
        (err) => {
          this.updateSuccess = false;
          this.loading = false;
          this.errorMessage = err.error?.detail;
        }
      );
    } else {
      console.log('Form is not valid');
      this.loading = false;
    }
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
