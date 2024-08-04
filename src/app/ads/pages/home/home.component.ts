import { ViewportScroller } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  faAnglesRight,
  faArrowLeft,
  faArrowRight,
  faBed,
  faBolt,
  faBook,
  faCalendarDays,
  faCar,
  faChair,
  faChild,
  faFilter,
  faHome,
  faImage,
  faList,
  faLocationDot,
  faPersonChalkboard,
  faPersonDigging,
  faSort,
  faSpa,
  faTag,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as starReg } from '@fortawesome/free-regular-svg-icons';
import { faStar as starSolid } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import {
  AdSearchQuery,
  GeneralAd,
  PropertyAd,
  PropertySearchQuery,
} from 'src/app/model/all-ads';
import { Address, PostcodeDistrict, PostcodeDistrictQuery } from 'src/app/model/common';
import { AdsService } from 'src/app/services/ads/ads.service';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/services/common/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  @ViewChild('pScroller', { read: ElementRef })
  public pScroller: ElementRef<any>;

  @ViewChild('adScroller', { read: ElementRef })
  public adScroller: ElementRef<any>;

  adService = inject(AdsService);
  modalService = inject(NgbModal);
  locationService = inject(LocationService);

  location: Address;
  category: string;
  propertyType: string;
  consumptionType: string;
  minAmount: number;
  maxAmount: number;
  minBed: number;
  maxBed: number;
  properties: PropertyAd[] = [];
  ads: GeneralAd[] = [];

  faFilter = faFilter;
  faSort = faSort;
  faTag = faTag;
  faBed = faBed;
  faHomes = faHome;
  faCars = faCar;
  faKids = faChild;
  faBooks = faBook;
  faElectronics = faBolt;
  faJobs = faPersonDigging;
  faServices = faSpa;
  faClasses = faPersonChalkboard;
  faEvents = faCalendarDays;
  faFurniture = faChair;
  faAll = faList;
  faImage = faImage;
  faLocation = faLocationDot;
  // faArrowRight = faChevronRight;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faStarR = starReg;
  faStarS = starSolid;

  isNavCollapse = false;
  postcodeDistrict: PostcodeDistrict;
  error: boolean;
  errorMessage: string;

  @HostListener('window:scroll', []) onScroll() {
    if (this.scroll.getScrollPosition()[1] > 70) {
      this.isNavCollapse = true;
    } else {
      this.isNavCollapse = false;
    }
  }

  categories: Category[] = [
    {
      name: 'All',
      icon: this.faAll,
    },
    {
      name: 'Property',
      icon: this.faHomes,
    },
    {
      name: 'Cars',
      icon: this.faCars,
    },
    {
      name: 'Kids',
      icon: this.faKids,
    },
    {
      name: 'Electronics',
      icon: this.faElectronics,
    },
    {
      name: 'Books',
      icon: this.faBooks,
    },
    {
      name: 'Jobs',
      icon: this.faJobs,
    },
    {
      name: 'Furniture',
      icon: this.faFurniture,
    },
    {
      name: 'Services',
      icon: this.faServices,
    },
    {
      name: 'Classes',
      icon: this.faClasses,
    },
  ];
  showLandingPage: boolean;
  searchRadius: any;
  groupedAds: Map<string, GeneralAd[]>;


  constructor(private scroll: ViewportScroller, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      var category = params['category'];
      if (category) {
        this.category = category;
        console.log('Viewing ' + category)
        this.onSelectCategory(category);
      } else {
        this.category = 'All';
        this.getAll();
      }
    });
  }

  nomalise(category: string) {

  }

  onEmitAddress(address: Address) {
    this.location = address;
    console.log('Address emitted ' + JSON.stringify(address));
  }

  onWheel(event: WheelEvent): void {
    if (event.deltaY > 0) this.scrollToRight();
    else this.scrollToLeft();
  }

  scrollToLeft(): void {
    document.getElementById('scroll-1').scrollLeft -= 400;
  }

  scrollToRight(): void {
    document.getElementById('scroll-1')!.scrollLeft += 400;
  }


  public scrollRight(e: string): void {
    if (e === 'pScroller') {
      this.pScroller.nativeElement.scrollLeft += 150;
      // this.pScroller.nativeElement.scrollTo({
      //   left: this.pScroller.nativeElement.scrollLeft + 150,
      //   behavior: 'smooth',
      // });
    } else {
      window.alert('Scrolling right ' + e)
      this.adScroller.nativeElement.scrollLeft += 150;
      // this.adScroller.nativeElement.scrollTo({
      //   left: this.adScroller.nativeElement.scrollLeft + 150,
      //   behavior: 'smooth',
      // });
    }
  }


  public scrollLeft(e: string): void {
    if (e === 'pScroller') {
      this.pScroller.nativeElement.scrollLeft -= 150;
      // this.pScroller.nativeElement.scrollTo({
      //   left: this.pScroller.nativeElement.scrollLeft - 150,
      //   behavior: 'smooth',
      // });
    } else {
      window.alert('Scrolling ' + e);
      this.adScroller.nativeElement.scrollLeft -= 150;
      // this.adScroller.nativeElement.scrollTo({
      //   left: this.adScroller.nativeElement.scrollLeft - 150,
      //   behavior: 'smooth',
      // });
    }
  }

  private getAll() {
    var query: PropertySearchQuery = {};
    query.lastMonth = true;
    this.adService.getProperties(query).subscribe((d) => {
      this.properties = d;
    });
    var adQuery: AdSearchQuery = {};
    adQuery.lastMonth = true;
    this.adService.getAds(adQuery).subscribe((d) => {
      this.ads = d;
      console.log('Total ads retrieved ' + this.ads.length)
      this.groupedAds = this.ads.reduce(
        (result: any, currentValue: any) => {
          (result[currentValue['category']] = result[currentValue['category']] || []).push(currentValue);
          return result;
        }, {});
    });
  }


  onSelectPostcode(postcode: string) {
    if (postcode) {
      var postcodeSanitized: string = postcode.toUpperCase();
      var area = postcodeSanitized.match(/^(((([A-Z][A-Z]{0,1})[0-9][A-Z0-9]{0,1}) {0,}[0-9])[A-Z]{2})$/)[3];
      if (area) {
        this.fetchPostcodeDistrict(area);
        if (this.category) {
          if (this.category === 'Property' || this.category === 'Propertes' || this.category === 'property' || this.category === 'propertes') {
            var query: PropertySearchQuery = {};
            query.area = area;
            query.postcode = postcode;
            this.adService.getProperties(query).subscribe((d) => {
              this.properties = d;
            });
          } else {
            var adQuery: AdSearchQuery = {};
            adQuery.postcodeDistrict = area;
            adQuery.category = this.category;
            adQuery.postcode = postcode;
            this.getAds(adQuery);
          }
        }
      } else {
        var query: PropertySearchQuery = {};
        query.area = area;
        query.postcode = postcode;
        this.adService.getProperties(query).subscribe((d) => {
          this.properties = d;
        });
        var adQuery: AdSearchQuery = {};
        adQuery.postcodeDistrict = area;
        adQuery.category = this.category;
        adQuery.postcode = postcode;
        this.getAds(adQuery);
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
        if (e && e.length > 0) {
          this.postcodeDistrict = e[0];

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

  onChangeLocation(e: any) {
    this.location = e.target.value;
  }

  onSelectCategory(e: string) {
    this.category = e;
    var adQuery: AdSearchQuery = {};
    adQuery.lastMonth = true;
    switch (this.category) {
      case 'All':
      case 'all':
        this.getAll();
        break;
      case 'Property':
      case 'Properties':
      case 'properties':
        var query: PropertySearchQuery = {};
        query.lastMonth = true;
        this.adService.getProperties(query).subscribe((d) => {
          this.properties = d;
        });
        break;
      case 'Car':
      case 'Cars':
      case 'cars':
      case 'car':
        adQuery.category = 'Car';
        this.getAds(adQuery);
        break;
      case 'Furniture':
      case 'furnitures':
        adQuery.category = 'Furniture';
        this.getAds(adQuery);
        break;
      case 'Books':
      case 'books':
        adQuery.category = 'Books';
        this.getAds(adQuery);
        break;
      case 'Services':
      case 'services':
        adQuery.category = 'Services';
        this.getAds(adQuery);
        break;
      case 'Jobs':
      case 'jobs':
        adQuery.category = 'Jobs';
        this.getAds(adQuery);
        break;
      case 'Events':
      case 'events':
        adQuery.category = 'Events';
        this.getAds(adQuery);
        break;
      case 'Electronics':
      case 'electronics':
        adQuery.category = 'Electronics';
        this.getAds(adQuery);
        break;
      case 'Ads':
      case 'ads':
        this.getAds(adQuery);
        break;
      case 'Kids':
      case 'kids':
        adQuery.category = 'Kids';
        this.getAds(adQuery);
        break;
      default:
        break;
    }
  }

  private getAds(adQuery: AdSearchQuery) {
    this.adService.getAds(adQuery).subscribe((d) => {
      this.ads = d;
      console.log('Total ads retrieved ' + this.ads.length)
      this.groupedAds = this.ads.reduce(
        (result: any, currentValue: any) => {
          (result[currentValue['category']] = result[currentValue['category']] || []).push(currentValue);
          return result;
        }, {});
    });
  }

  unsetLocation() {
    this.postcodeDistrict = null;
    var adQuery: AdSearchQuery = {};
    this.getAds(adQuery);
  }

  isSelectedCategory(c: Category) {
    return this.category === c.name;
  }
  onChangeCategory(e: any) {
    this.category = e.target.value;
  }

  onChangePropertyTypeList(e: any) {
    this.propertyType = e.target.value;
    if (this.propertyType === 'Rooms') {
      this.consumptionType = "Rent";
    } else {
      this.consumptionType = "Sale";
    }
  }

  onChangeConsumptionType(e: any) {
    this.consumptionType = e.target.value;
  }

  selectPropertyType(evt: any) {
    this.propertyType = evt.target.value;
  }

  openModal(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'custom-class',
      })
      .result.then(
        (result) => { },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  close() {
    this.modalService.dismissAll();
  }

  handleSearchRadius(evt: any) {
    this.searchRadius = evt.target.value;
  }

  searchProperties() {
    var query: PropertySearchQuery = {};
    if (this.propertyType && this.propertyType !== 'Any') {
      query.type = this.propertyType;
    }
    if (this.location) {
      query.location = this.location.city;
    }
    if (this.consumptionType) {
      query.consumptionType = this.consumptionType;
    }
    if (this.minAmount) {
      query.minAmount = this.minAmount;
    }
    if (this.maxAmount) {
      query.maxAmount = this.maxAmount;
    }
    if (this.minBed) {
      query.minBedroom = this.minBed;
    }
    if (this.maxBed) {
      query.maxBedroom = this.maxBed;
    }
    console.log('property search query ' + JSON.stringify(query));
    this.adService.getProperties(query).subscribe((d) => {
      this.properties = d;
      console.log('Result ' + JSON.stringify(this.properties));
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export class Category {
  name: string;
  icon: IconDefinition;
}
