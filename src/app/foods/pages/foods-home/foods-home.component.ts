import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faClose, faCopyright, faLocation, faLocationDot, faMugHot, faReceipt, faSearch, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { Cuisine } from 'src/app/model/all-foods';
import { Address, PostcodeDistrict, PostcodeDistrictQuery, RapidApiByPostcodeResponse, RapidApiByPostcodeResponseSummary, ServiceLocation } from 'src/app/model/common';
import { LocationService } from 'src/app/services/common/location.service';
import { RapidApiService } from 'src/app/services/common/rapid-api.service';
import { Utils } from 'src/app/services/common/utils';
import { CuisinesService } from 'src/app/services/foods/cusines.service';

@Component({
  selector: 'app-foods-home',
  templateUrl: './foods-home.component.html',
  styleUrls: ['./foods-home.component.css']
})
export class FoodsHomeComponent implements OnInit, OnDestroy{
 
  destroy$ = new Subject<void>();

  faLocation = faLocation;
  faSearch = faSearch;
  faClose = faClose;
  faLocationDot = faLocationDot;
  faMugHot = faMugHot;
  faReceipt = faReceipt;
  faUtensils = faUtensils;
  faCopyright = faCopyright;

  router = inject(Router);
  cuisinesService = inject(CuisinesService);
  modalService = inject(NgbModal);
  locationService = inject(LocationService);
  rapidApiService = inject(RapidApiService);


  showAddressList: boolean;
  postcodeDistrictsSearchText: any;
  selectedPostcodeDistrict: PostcodeDistrict;

  popularDistricts: PostcodeDistrict[];
  cuisines: Cuisine[] = [];
  cuisineMap: Map<String, Cuisine> = new Map<String, Cuisine>();
  postcodeDistricts: PostcodeDistrict[];

  customerAddress: Address;
  addressLookupPostcode: string;
  hidePostcodeLookupForm: boolean;
  postcodeAddressList: RapidApiByPostcodeResponseSummary[];
  rapidApiByPostcodeResponseSummary: RapidApiByPostcodeResponseSummary;
  postcode: string;
  addressSelected: boolean;
  postcodeDistrict: PostcodeDistrict;
  invalidPostcodeDistrict: boolean;
  error: boolean;
  errorMessage: string;

  ngOnInit(): void {
    this.fetchPopularPostcodeDistricts();
    this.cuisinesService.getCuisines().subscribe((d) => {
      this.cuisines = d;
      for (var i = 0; i < d.length; i++) {
        var theCuisine = d[i];
        this.cuisineMap.set(theCuisine.name, theCuisine);
      }
    });
  }

  fetchPopularPostcodeDistricts() {
    var query: PostcodeDistrictQuery= {};
    query.popular = true;
    this.locationService
      .fetchPostcodeDistricts(query)
      // .pipe(first())
      .subscribe(
        (data: PostcodeDistrict[]) => {
          this.popularDistricts = data;
        },
        (error) => {
          console.log(
            'Popular postcode districts Lookup resulted an error.' +
            JSON.stringify(error)
          );
        }
      );
  }


  fetchAllPostcodeDistricts() {
    var query: PostcodeDistrictQuery= {};
    this.locationService
    .fetchPostcodeDistricts(query)
      // .pipe(first())
      .subscribe(
        (data: PostcodeDistrict[]) => {
          this.postcodeDistricts = data;
        },
        (error) => {
          console.log(
            'Postcode districts resulted an error.' + JSON.stringify(error)
          );
        }
      );
  }


  onSelectPostcodeDistrict(selectedPostcodeDistrict: PostcodeDistrict) {
    this.close();
    this.selectedPostcodeDistrict = selectedPostcodeDistrict;
    // this.fetchChefsByServiceLocation(selectedServiceLocation);
    this.router
      .navigate(['/ck/area'], {
        queryParams: { location: selectedPostcodeDistrict.slug },
      })
      .then();
    console.log('Selected location: ' + selectedPostcodeDistrict.prefix);
  }
  
  // onEnter(content) {
  //   if (this.addressLookupPostcode &&this.addressLookupPostcode.length >= 5) {
  //     this.doPostcodeLookup();
  //   }
   
  // }
  open(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'custom-class',
      })
      .result.then(
        (result) => {},
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }


  onSelectPostcode(postcode: string) {
    if (postcode){
      var postcodeSanitized: string = postcode.toUpperCase();
      var area = postcodeSanitized.match(/^(((([A-Z][A-Z]{0,1})[0-9][A-Z0-9]{0,1}) {0,}[0-9])[A-Z]{2})$/)[3];
      if ( area){
        this.fetchPostcodeDistrict(area);
      }
    }
  }

  fetchPostcodeDistrict(area: string) {
    var query = new PostcodeDistrictQuery();
    query.prefix = area;
    var observable = this.locationService.fetchPostcodeDistricts(query);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        console.log('Fetched postcode district from prefix ' + area + ". List " + JSON.stringify(e));
        if ( e && e.length > 0){
          this.postcodeDistrict = e[0];
          if ( this.postcodeDistrict){
            this.router.navigateByUrl(
              '/ck/area/' + area
            );
          }else{
            this.error = true;
            this.errorMessage =
              'Oops. There was a problem. There are no home kitchens in this area. Plese try other postcodes' ;
          }
        }else{
          this.error = true;
          this.errorMessage =
            'Oops. There was a problem. There are no home kitchens in this area. Plese try other postcodes' ;
        }
      },
      error: (err) => {
        console.error('Errors during posting ad. ' + JSON.stringify(err));
        this.error = true;
        this.errorMessage =
          'Oops. There was a problem. Please contact customer support quoting reference ' +
          err.error.reference;
      },
    });
  }

  closeServiceLocations() {
    this.showAddressList = false;
    this.addressLookupPostcode = undefined;
    this.postcodeAddressList = [];
  }

  findAddress() {
    if (this.addressLookupPostcode &&this.addressLookupPostcode.length >= 5) {
      this.doPostcodeLookup();
    }
  }

  onSubmitPostcodeLookup() {
    console.log('Search address form submitted..');
    if (this.addressLookupPostcode &&this.addressLookupPostcode.length >= 5) {
      this.doPostcodeLookup();
    }
  }

  doPostcodeLookup() {
    this.rapidApiService
      .lookupAddresses(this.addressLookupPostcode.trim())
      // .pipe(first())
      .subscribe(
        (data: RapidApiByPostcodeResponse) => {
          this.postcodeAddressList = data.Summaries;
          this.addressSelected = false;
          this.showAddressList = true;
          console.log('Address Lookup response ' +JSON.stringify(this.postcodeAddressList));
        },
        (error) => {
          console.log( 'Address Lookup resulted an error.' + JSON.stringify(error));
        }
      );
  }

  // onSelectDeliveryAddress(selectAddress: RapidApiByPostcodeResponseSummary) {
  //   var city = selectAddress.Place.split(/[\s ]+/).pop();
  //   this.customerAddress = {
  //     city: city,
  //     addressLine1: selectAddress.StreetAddress,
  //     addressLine2: selectAddress.Place,
  //     country: 'UK',
  //     postcode: this.addressLookupPostcode,
  //     latitude: '',
  //     longitude: '',
  //   };
  //   this.addressSelected = true;
  //   var area = this.addressLookupPostcode.trim().substring(0,3);
  //   var query: PostcodeDistrictQuery= {};
  //   query.area = area;
  //   this.locationService.fetchPostcodeDistricts(query).subscribe((pd) => {
  //     if (Utils.isValid(pd)) {
  //       this.postcodeDistrict = pd[0];
  //       this.router.navigateByUrl("f/area/"+this.postcodeDistrict.slug);
  //     }else{
  //       this.invalidPostcodeDistrict = true;
  //     }
  //   });
  // }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close() {
    this.modalService.dismissAll();
  }

  ngAfterViewInit() { }
}

