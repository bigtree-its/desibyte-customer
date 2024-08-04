import { KeyValue } from '@angular/common';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil, throwError } from 'rxjs';
import {
  GeneralAd,
  PropertyAd,
  School,
  SuperStore,
} from 'src/app/model/all-ads';
import { User } from 'src/app/model/all-auth';
import { Address, NameValue, PostalLocation, PostcodeDistrict, PostcodeDistrictQuery } from 'src/app/model/common';
import { AdsService } from 'src/app/services/ads/ads.service';
import { AccountService } from 'src/app/services/auth/account.service';
import { FileUploadService } from 'src/app/services/common/image-upload.service';
import { LocationService } from 'src/app/services/common/location.service';
import { ServiceLocator } from 'src/app/services/common/service.locator';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-post-ad',
  templateUrl: './post-ad.component.html',
  styleUrls: ['./post-ad.component.css'],
})
export class PostAdComponent implements OnInit, OnDestroy {
  faTrash = faTrash;

  status: 'fileLimitReached' | 'initial' | 'uploading' | 'success' | 'fail' = 'initial'; // Variable to store file status
  file: File | null = null; // Variable to store file
  files: any[] = [];
  fileMap: Map<string, File> = new Map<string, File>();
  myMap: Map<string, string> = new Map<string, string>();

  destroy$ = new Subject<void>();
  accountService = inject(AccountService);
  adService = inject(AdsService);
  serviceLocator = inject(ServiceLocator);
  http = inject(HttpClient);
  uploadService = inject(FileUploadService);
  locationService = inject(LocationService);

  @ViewChild('ref') ref:ElementRef;

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
  uploadedImages: ImageKitImage[] = [];
  uploading: boolean = false;

  selectedFiles?: FileList;
  currentFile?: File;
  imageFiles?: File[] = [];
  progress = 0;
  message = '';
  preview = '';

  imageInfos?: Observable<any>;
  postcodeDistrict: PostcodeDistrict;
  postalLocation: PostalLocation;

  ngOnInit() {
    this.accountService.getData();
    this.accountService.loginSession$.subscribe({
      next: (value) => {
        this.user = value;
      },
      error: (err) => console.error('User$ emitted an error: ' + err),
      complete: () => console.log('User$ emitted the complete notification'),
    });

    // this.imageInfos = this.uploadService.getFiles();
  }

  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.imageInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the image!';
            }

            this.currentFile = undefined;
          },
        });
      }
      this.selectedFiles = undefined;
    }
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
    if (!this.postalLocation) {
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
    if (Utils.isEmpty(this.description) || this.description.length < 10) {
      this.error = true;
      this.errorMessage =
        'Give some resoanble description';
      return null;
    }
    return {
      title: this.title,
      category: this.category,
      description: this.description?.split('[n]'),
      status: 'Available',
      location: this.postalLocation,
      price: this.price,
      dateAvailable: Utils.getJsDate(this.dateAvailable),
      datePosted: new Date(),
      adOwner: {
        _id: this.user._id,
        name: this.user.name,
        email: this.user.email,
        mobile: this.user.mobile,
        address: null,
      },
    };
  }

  postNewAd() {
    this.postSuccessful = false;
    this.postedAd = null;
  }

  private postGeneralAd(ad: GeneralAd) {
    this.error = false;
    let observable = this.adService.postAd(ad);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        console.log('Ad has been posted');
        // this.postSuccessful = true;
        this.postedAd = e;
        this.uploadImages(this.postedAd);
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
      // gallery: this.gallery?.trim().split(','),
      type: this.propertyType,
      tenure: this.propertyTenure,
      status: 'Available',
      reference: '',
      // image: this.image,
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
        _id: this.user._id,
        name: this.user.name,
        email: this.user.email,
        mobile: this.user.mobile,
        address: null,
      },
    };
  }

  onSelectPostcode(postcode: string) {
    if (postcode) {
      var postcodeSanitized: string = postcode.toUpperCase();
      var area = postcodeSanitized.match(/^(((([A-Z][A-Z]{0,1})[0-9][A-Z0-9]{0,1}) {0,}[0-9])[A-Z]{2})$/)[3];
      if (area) {
        var query = new PostcodeDistrictQuery();
        query.prefix = area;
        var observable = this.locationService.fetchPostcodeDistricts(query);
        observable.pipe(takeUntil(this.destroy$)).subscribe({
          next: (e) => {
            console.log('Fetched postcode district from prefix ' + area + ". List " + JSON.stringify(e));
            if ( e && e.length > 0){
              this.postcodeDistrict = e[0];
              this.postalLocation = new PostalLocation();
              this.postalLocation.postcode = postcode;
              this.postalLocation.city = this.postcodeDistrict.city;
              this.postalLocation.coverage = this.postcodeDistrict.coverage;
              this.postalLocation.postcodeDistrict = this.postcodeDistrict.prefix;
            }
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
    }
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
      const response = await fetch(this.serviceLocator.ImageKitTokenUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  validateFileFunction(res: File) {
    this.uploading = true;
    console.log('Upload validating');
    if (res.size < 1000000) {
      // Less than 1mb file size
      return true;
    }
    return false;
  }

  onUploadStartFunction(res: Event) {
    this.uploading = true;
    console.log('Upload starting');
  }

  onUploadProgressFunction(res: ProgressEvent) {
    this.uploading = true;
    console.log('Upload in progress');
  }

  handleUploadError = (event: any) => {
    this.uploading = false;
    console.log('Upload resulted in Error');
    console.log(event);
  };

  handleUploadSuccess = (event: any) => {
    this.uploading = false;
    console.log(event.$ResponseMetadata.statusCode); // 200
    console.log(event.$ResponseMetadata.headers); // headers
    console.log(event); // headers
    console.log('Upload Success');
    if (event.url) {
      var img: ImageKitImage = {};
      img.fileId = event.fileId;
      img.filePath = event.filePath;
      img.thumbnailUrl = event.thumbnailUrl;
      img.name = event.name;
      img.url = event.url;
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

  deleteFile(name: string) {
    this.myMap.delete(name);
    // window.alert('Deleting '+ name)
  }

  deleteImageKitFile(_t67: ImageKitImage) {
    var idx = -1;
    for (var i = 0; i < this.uploadedImages.length; i++) {
      var fi = this.uploadedImages[i];
      if (fi.fileId === _t67.fileId) {
        idx = i;
        break;
      }
    }
    console.log('Deleting ' + _t67.fileId + ' at index ' + idx);
    this.adService.deleteImage(_t67.fileId).subscribe((e) => {
      if (idx !== -1) {
        this.uploadedImages.splice(idx, 1);
      }
    });
  }

  // On file Select
  onChange(event: any) {
   
    const files = event.target.files;
    if (files.length) {
      this.status = 'initial';
      // this.files = this.files.concat(files);

      [...files].forEach((file) => {
        this.files.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.myMap.set(file.name, e.target.result);
          if ( this.files.length === 5){
            this.status = 'fileLimitReached';
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  uploadImages(ad: GeneralAd) {
    console.log('Now upload the files')
    if (this.files.length) {
      const formData = new FormData();

      //We deconstruct this.files to convert the FileList to an array, enabling us to utilize array methods like map or forEach.
      [...this.files].forEach((file) => {
        console.log('Uploading image ' + file.name)
        formData.append("files", file, file.name);
      });

      let observable = this.adService.uploadImages(ad, formData);
      observable.pipe(takeUntil(this.destroy$)).subscribe({
        next: (e) => {
          console.log('Upload image complete.')
          this.status = 'success';
          this.postSuccessful = true;
        },
        error: (err) => {
          console.error('Errors during posting images. ' + JSON.stringify(err));
          this.status = 'fail';
        },
      });
    } else {
      console.error('No images files selected.')
    }
  }
}

class ImageKitImage {
  fileId?: string;
  name?: string;
  url?: string;
  filePath?: string;
  thumbnailUrl?: string;
}
