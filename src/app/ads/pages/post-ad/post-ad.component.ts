import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import {
  GeneralAd,
  PropertyAd,
  School,
  SuperStore,
} from 'src/app/model/all-ads';
import { User } from 'src/app/model/all-auth';
import { Address, NameValue } from 'src/app/model/common';
import { AdsService } from 'src/app/services/ads/ads.service';
import { AccountService } from 'src/app/services/auth/account.service';
import { ServiceLocator } from 'src/app/services/common/service.locator';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-post-ad',
  templateUrl: './post-ad.component.html',
  styleUrls: ['./post-ad.component.css'],
})
export class PostAdComponent implements OnInit, OnDestroy {

  faTrash= faTrash;

  destroy$ = new Subject<void>();
  accountService = inject(AccountService);
  adService = inject(AdsService);
  serviceLocator = inject(ServiceLocator);
  http = inject(HttpClient);

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
  error: boolean;
  showLoginOptions: boolean;

  postedAd: GeneralAd;
  postedProperty: PropertyAd;
  postSuccessful: boolean = false;

  // Upload
  uploadedImages: ImagekitImage[] = [];
  status: string;

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
      if (Utils.isValid(propertyAd)) {
        this.postPropertyAd(propertyAd);
      }
    } else {
      var ad: GeneralAd = this.buildGeneralAd();
      if (ad) {
        this.postGeneralAd(ad);
      }

    }
  }

  buildGeneralAd(): GeneralAd {
    if (!this.category) {
      this.error = true;
      this.errorMessage = 'Ad category is mandatory';
      return null;
    }
    if (!this.adAddress) {
      this.error = true;
      this.errorMessage = 'Ad Location is mandatory';
      return null;
    }
    if (!this.price) {
      this.error = true;
      this.errorMessage = 'Price must be entered';
      return null;
    }
    if (!this.dateAvailable) {
      this.error = true;
      this.errorMessage = 'Date available is mandatory';
      return null;
    }
    if (Utils.isEmpty(this.title)) {
      this.error = true;
      this.errorMessage = 'Title is mandatory';
      return null;
    }
    if (Utils.isEmpty(this.description) || this.description.length < 50) {
      this.error = true;
      this.errorMessage =
        'Description is mandatory and at least 50 chars in length';
      return null;
    }

    return {
      title: this.title,
      category: this.category,
      description: this.description?.split('[n]'),
      gallery: this.gallery?.trim().split(','),
      status: 'Available',
      image: this.image,
      address: this.adAddress,
      price: this.price,
      dateAvailable: Utils.getJsDate(this.dateAvailable),
      datePosted: new Date(),
      adOwner: {
        _id: this.user.id,
        name: this.user.firstName + ' ' + this.user.lastName,
        email: this.user.email,
        mobile: this.user.mobile,
        address: null,
      },
    };
  }

  private postGeneralAd(ad: GeneralAd) {
    this.error = false;
    let observable = this.adService.postAd(ad);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        console.log('Ad has been posted');
        this.postSuccessful = true;
        this.postedAd = e;
      },
      error: (err) => {
        console.error('Errors during posting ad. ' + JSON.stringify(err));
        this.error = true;
        this.errorMessage =
          'Oops. There was a problem when posting your ad. Please contact customer support quoting reference ' +
          err.error.reference;
      },
    });
  }

  private postPropertyAd(propertyAd: PropertyAd) {
    this.error = false;
    let observable = this.adService.postProperty(propertyAd);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        console.log('Property ad has been posted');
        this.postSuccessful = true;
        this.postedProperty = e;
      },
      error: (err) => {
        console.error('Errors during posting ad. ' + JSON.stringify(err));
        this.error = true;
        this.errorMessage =
          'Oops. There was a problem when posting your ad. Please contact customer support quoting reference ' +
          err.error.reference;
      },
    });
  }

  private buildPropertyAd(): PropertyAd {
    if (!this.adAddress) {
      this.error = true;
      this.errorMessage = 'Property Address is mandatory';
      return null;
    }
    if (!this.propertyType) {
      this.error = true;
      this.errorMessage = 'Property type is mandatory';
      return null;
    }
    if (
      this.propertyType !== 'Garage' &&
      this.propertyType !== 'Commercial' &&
      !this.propertyTenure
    ) {
      this.error = true;
      this.errorMessage = 'Property tenure is mandatory';
      return null;
    }
    if (
      this.propertyType !== 'Garage' &&
      this.propertyType !== 'Commercial' &&
      !this.bedrooms
    ) {
      this.error = true;
      this.errorMessage = 'Bedrooms must be selected';
      return null;
    }
    if (
      this.propertyType !== 'Garage' &&
      this.propertyType !== 'Commercial' &&
      !this.bathrooms
    ) {
      this.error = true;
      this.errorMessage = 'Bathrooms must be selected';
      return null;
    }
    if (!this.price) {
      this.error = true;
      this.errorMessage = 'Price must be entered';
      return null;
    }
    if (!this.dateAvailable) {
      this.error = true;
      this.errorMessage = 'Date available is mandatory';
      return null;
    }
    if (Utils.isEmpty(this.title)) {
      this.error = true;
      this.errorMessage = 'Title is mandatory';
      return null;
    }
    if (Utils.isEmpty(this.description) || this.description.length < 50) {
      this.error = true;
      this.errorMessage =
        'Description is mandatory and at least 50 chars in length';
      return null;
    }

    return {
      title: this.title,
      summary: this.summary,
      description: this.description?.split('[n]'),
      keyFeatures: this.keyFeatures?.split('[n]'),
      gallery: this.gallery?.trim().split(','),
      type: this.propertyType,
      tenure: this.propertyTenure,
      status: 'Available',
      reference: '',
      image: this.image,
      size: this.size,
      schools: this.schools,
      stations: this.stations,
      parks: this.parks,
      malls: this.malls,
      hospitals: this.hospitals,
      shops: this.shops,
      leisureCenters: this.leisureCenters,
      floorPlan: this.floorPlan?.split(','),
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
    if (this.category === 'Property') {
      this.consumptionType = 'Rent';
      this.rentPeriod = 'Monthly';
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

  authenticator = async () => {
    try {
      const response = await fetch(this.serviceLocator.ImagekitTokenUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  validateFileFunction(res: File) {
    console.log("Validating");
    if (res.size < 1000000) { // Less than 1mb file size
      return true;
    }
    this.status = "1MB exceeded"
    return false;
  }

  onUploadStartFunction(res: Event) {
    this.status = "Starting to upload";
  }

  onUploadProgressFunction(res: ProgressEvent) {
    this.status = "Progressing..";
  }

  handleUploadError = (event: any) => {
    console.log('Error');
    console.log(event);
  };

  handleUploadSuccess = (event: any) => {
    this.status = "Success";
    console.log(event.$ResponseMetadata.statusCode); // 200
    console.log(event.$ResponseMetadata.headers); // headers
    console.log(event);
    if (event.url) {
      var img: ImagekitImage = {};
      img.fileId = event.fileId
      img.filePath = event.filePath
      img.thumbnailUrl = event.thumbnailUrl
      img.name = event.name
      img.url = event.url
      this.uploadedImages.push(img);
    }
  };

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeAlert() {
    this.adSubmitted = false;
    this.error = false;
    this.errorMessage = null;
  }

  deleteFile(_t67: ImagekitImage) {
    var idx = -1;
    for (var i = 0; i < this.uploadedImages.length; i++) {
      var fi = this.uploadedImages[i];
      if (fi.fileId === _t67.fileId) {
        idx = i;
        break;
      }
    }
    console.log('Deleting '+ _t67.fileId+ ' at index '+ idx)
    this.adService.deleteImage(_t67.fileId).subscribe(e=>{
      if ( idx !== -1){
        this.uploadedImages.splice(idx, 1);
      }
    });
  }
}

class ImagekitImage {
  fileId?: string;
  name?: string;
  url?: string;
  filePath?: string;
  thumbnailUrl?: string;
}
