import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { PropertyAd, School, SuperStore } from 'src/app/model/all-ads';
import { User } from 'src/app/model/all-auth';
import { Address, NameValue } from 'src/app/model/common';
import { AdsService } from 'src/app/services/ads/ads.service';
import { AccountService } from 'src/app/services/auth/account.service';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-post-ad',
  templateUrl: './post-ad.component.html',
  styleUrls: ['./post-ad.component.css'],
})
export class PostAdComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  accountService = inject(AccountService);
  adService = inject(AdsService);

  submitted: boolean = false;
  loading: boolean = false;
  successful: boolean = false;

  // Common
  category: string;
  title: string;
  description: string;
  adAddress: Address;
  dateAvailable: NgbDateStruct;
  minDate: any;
  faCalendar = faCalendar;
  saleAmount: number;

  // Property
  consumptionType: string;
  propertySaleOffersOver: boolean;
  price: number;
  rentPeriod: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  user: User;
  adSubmitted: boolean;
  errorMessage: any;
  propertyTenure: any;
  size: string;
  image: string;
  keyFeatures: any;
  gallery: string;
  schools: School[] = [];
  superStores: SuperStore[] = [];
  floorPlan: string;
  leisureCenters: NameValue[] = [];
  shops: NameValue[] = [];
  hospitals: NameValue[] = [];
  summary: string;
  stations: NameValue[];
  parks: NameValue[];
  malls: NameValue[];

  ngOnInit() {
    this.accountService.getData();
    this.accountService.loginSession$.subscribe({
      next: (value) => {
        this.user = value;
      },
      error: (err) => console.error('User$ emitted an error: ' + err),
      complete: () => console.log('User$ emitted the complete notification'),
    });
  }

  postAd() {
    if (this.category === 'Property') {
      var propertyAd: PropertyAd = this.buildPropertyAd();
      if ( Utils.isValid(propertyAd)){
        this.postPropertyAd(propertyAd);
      }
     
    }
  }

  private postPropertyAd(propertyAd: PropertyAd) {
    let observable = this.adService.postProperty(propertyAd);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        console.log('Property ad has been posted');
        this.adSubmitted = true;
      },
      error: (err) => {
        console.error('Errors during posting ad.');
        this.errorMessage = err.error.detail;
      },
    });
  }

  private buildPropertyAd(): PropertyAd {
    if ( Utils.isEmpty(this.title)){
      this.errorMessage = "Title is mandatory";
      return null;
    }
    if ( Utils.isEmpty(this.description) ||  this.description.length < 50){
      this.errorMessage = "Description is mandatory and at least 50 chars in length";
      return null;
    }
    if (!this.adAddress){
      this.errorMessage = "Property Address is mandatory";
      return null;
    }
    if (!this.propertyType){
      this.errorMessage = "Property type is mandatory";
      return null;
    }
    if (!this.dateAvailable){
      this.errorMessage = "Date available is mandatory";
      return null;
    }
    if (!this.bedrooms){
      this.errorMessage = "Bedrooms must be selected";
      return null;
    }
    if (!this.bathrooms){
      this.errorMessage = "Bathrooms must be selected";
      return null;
    }
    return {
      title: this.title,
      summary: this.summary,
      description: this.description?.split("[n]"),
      keyFeatures: this.keyFeatures?.split("[n]"),
      gallery: this.gallery?.trim().split(","),
      type: this.propertyType,
      tenure: this.propertyTenure,
      status: "Available",
      reference: "",
      image: this.image,
      size: this.size,
      schools: this.schools,
      stations: this.stations,
      parks: this.parks,
      malls: this.malls,
      hospitals: this.hospitals,
      shops: this.shops,
      leisureCenters: this.leisureCenters,
      floorPlan: this.floorPlan?.split(","),
      superStores: this.superStores,
      consumptionType: this.consumptionType,
      address: this.adAddress,
      price: this.price,
      saleAmountOfferOver: this.propertySaleOffersOver,
      rentPeriod: this.rentPeriod,
      dateAvailable: Utils.getJsDate(this.dateAvailable),
      datePosted: new Date(),
      bedrooms: this.bedrooms,
      bathrooms: this.bathrooms,
      featured: false,
      adOwner: {
        _id: this.user.id,
        name: this.user.firstName + ' ' + this.user.lastName,
        email: this.user.email,
        mobile: this.user.mobile,
        address: null,
      },
    };


  }

  onChangeCategory(e: any) {
    this.category = e.target.value;
    if (this.category === 'Property'){
      this.consumptionType = "Rent";
      this.rentPeriod = "Monthly";
    }
  }

  onChangePropertyType(e: any) {
    this.propertyType = e.target.value;
  }

  onChangePropertyTenure(e: any) {
    this.propertyTenure = e.target.value;
  }

  onChangeBedrooms(e: any) {
    this.bedrooms = e.target.value;
  }

  onChangeBathrooms(e: any) {
    this.bathrooms = e.target.value;
  }

  changePropertyConsumptionType(evt: any) {
    this.consumptionType = evt.target.value;
  }

  handleRentalPeriod(evt: any) {
    this.rentPeriod = evt.target.value;
  }
  onSelectAddress(address: Address) {
    this.adAddress = address;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
