import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { faAddressCard, faArrowLeft, faBookOpen, faFileInvoiceDollar, faLocationPin, faTrash, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil, takeWhile } from 'rxjs';
import { User } from 'src/app/model/all-auth';
import { KitchenOrderProfileResponse } from 'src/app/model/all-food-supplier';
import {
  CloudKitchen,
  Collection,
  Cuisine,
  Menu,
} from 'src/app/model/all-foods';
import {
  Address,
  Contact,
  PostcodeDistrict,
  PostcodeDistrictQuery,
} from 'src/app/model/common';
import { AccountService } from 'src/app/services/auth/account.service';
import { LocationService } from 'src/app/services/common/location.service';
import { Utils } from 'src/app/services/common/utils';
import { CloudKitchenService } from 'src/app/services/foods/cloudkitchen.service';
import { ProfileService } from 'src/app/services/supplier/profile.service';
import { SupplierOrderService } from 'src/app/services/supplier/supplier-order.service';

@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.css'],
})
export class MyHomeComponent implements OnInit, OnDestroy {
  kitchenService = inject(CloudKitchenService);
  accountService = inject(AccountService);
  profileService = inject(ProfileService);
  locationService = inject(LocationService);
  supplierOrderService = inject(SupplierOrderService);

  user: User;
  destroy$ = new Subject<void>();
  cloudKitchen: CloudKitchen;
  errorMessage: any;

  faClose = faTrash;
  faArrowLeft = faArrowLeft;
  fileInvoiceDollar = faFileInvoiceDollar;
  bookOpen = faBookOpen;
  addressCard = faAddressCard;
  locationPin = faLocationPin;
  faUtensils = faUtensils;

  // Setup
  section: string;
  freeDeliveryOrderOver: any;
  deliveryFee: any;
  packagingFee: any;
  kitchenName: string;
  description: string;
  keyword: string;
  cuisineInput: string;
  kitchenAddress: Address;
  cuisines: Cuisine[];

  showKitchenName: boolean;
  showKitchenAddress: boolean;
  showCuisines: boolean;
  showDescription: boolean;
  showDeliverySection: boolean;
  showContact: boolean;
  showServiceLocations: boolean;
  showPartyOrderForm: boolean;
  takePartyOrders: any;
  searchTextPostcodeDistrict: string;
  postcodeDistricts: PostcodeDistrict[];
  saveKitchenStatus: boolean;
  doDelivery: any;
  setupKitchenFlag: boolean;
  showComponent: string;
  activeLayout: string = 'Home';
  leafTemplate: string;
  loadingKitchen: boolean;
  loadingError: boolean;
  collections: Collection[];
  menus: Menu[];
  specials: Menu[];
  orderProfile: KitchenOrderProfileResponse;
  notification: string;

  ngOnInit(): void {
    this.fetchCuisines();
    this.accountService.loginSession$.subscribe((e) => {
      if (e) {
        this.user = e;
        this.fetchMyKitchen(e);
      }
    });
  }

  private fetchCuisines() {
    let observable = this.profileService.fetchAllCuisine();
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.cuisines = data;
        this.loadingError = false;
      },
      error: (err) => {
        console.error('Errors while fetching cuisines.' + JSON.stringify(err));
        this.errorMessage = err.error.detail;
        this.loadingError = true;
      },
    });
  }

  private fetchMyKitchen(e: User) {
    this.loadingKitchen = true;
    let observable = this.kitchenService.fetchKitchen(e.email);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        console.log('Kitchen ' + data);
        this.loadingKitchen = false;
        this.loadingError = false;
        if (data) {
          this.cloudKitchen = data[0];
          if (!this.cloudKitchen) {
            var kitchen: CloudKitchen = {};
            var contact: Contact = {};
            kitchen.contact = contact;
            this.cloudKitchen = kitchen;
            this.setupKitchenFlag = true;
            this.setupKitchen();
            console.log('Initialising new cloudkitchen');
          } else {
            this.setupKitchenFlag = false;
            this.fetchCollections(this.cloudKitchen._id);
            this.fetchMenus(this.cloudKitchen._id);
            this.fetchOrders();
          }
        }
      },
      error: (err) => {
        this.loadingKitchen = false;
        this.loadingError = true;
        console.error(
          'Errors while fetching MyBusiness.' + JSON.stringify(err)
        );
        this.errorMessage = err.error.detail;
      },
    });
  }
  fetchOrders() {
    let observable = this.supplierOrderService.getProfile(
      this.cloudKitchen._id
    );
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        this.orderProfile = e;
      },
      error: (err) => {
        console.error(
          'Errors during loading orders for kitchen. ' + JSON.stringify(err)
        );
      },
    });
  }

  fetchCollections(cloudKitchenId: string) {
    this.kitchenService.getCollections(cloudKitchenId).subscribe(
      (data: Collection[]) => {
        this.collections = data;
      },
      (err) => {
        window.alert('Error when fetching the collections');
      }
    );
  }

  fetchMenus(cloudKitchenId: string) {
    this.kitchenService.getMenusForKitchen(cloudKitchenId).subscribe(
      (data: Menu[]) => {
        this.menus = data;
        this.specials = this.menus.filter((m) => {
          return m.special;
        });
      },
      (err) => {
        console.error('Error when fetching the menus');
      }
    );
  }

  selectCuisine(e: any, c: Cuisine) {
    if (!this.cloudKitchen.cuisines) {
      this.cloudKitchen.cuisines = [];
    }
    if (e.currentTarget.checked) {
      let found = false;
      for (var i = 0; i < this.cloudKitchen.cuisines?.length; i++) {
        var cuisine = this.cloudKitchen.cuisines[i];
        if (c.name === cuisine.name) {
          found = true;
        }
      }

      if (!found) {
        this.cloudKitchen.cuisines?.push(c);
      }
      console.log('Cuisines ' + JSON.stringify(this.cloudKitchen.cuisines));
    } else {
      for (var i = 0; i < this.cloudKitchen.cuisines?.length; i++) {
        var cuisine = this.cloudKitchen.cuisines[i];
        if (c.name === cuisine.name) {
          this.cloudKitchen.cuisines?.splice(i, 1);
          break;
        }
      }
    }
  }

  isSelected(c: Cuisine) {
    var found = false;
    for (var i = 0; i < this.cloudKitchen.cuisines?.length; i++) {
      var cuisine = this.cloudKitchen.cuisines[i];
      if (c.name === cuisine.name) {
        found = true;
        break;
      }
    }
    return found;
  }

  unSelectCuisine(c: Cuisine) {
    for (var i = 0; i < this.cloudKitchen.cuisines?.length; i++) {
      var cuisine = this.cloudKitchen.cuisines[i];
      if (c.name === cuisine.name) {
        this.cloudKitchen.cuisines.splice(i, 1);
        break;
      }
    }
  }

  setupKitchen() {
    console.log('Setup Kitchen..');
    this.setupKitchenFlag = true;
    this.showKitchenName = true;
    this.section = 'Your Kitchen';
  }

  setupNext() {
    if (this.showKitchenName) {
      if (
        Utils.isEmpty(this.cloudKitchen.name) ||
        Utils.isEmptyArray(this.cloudKitchen.description)
      ) {
        return;
      }
      this.showKitchenName = false;
      this.showKitchenAddress = true;
      this.section = 'Where is your kitchen located?';
    } else if (this.showKitchenAddress) {
      if (!this.cloudKitchen.address) {
        return;
      }
      this.showKitchenAddress = false;
      this.showContact = true;
      this.section = 'Your Contact Information';
    } else if (this.showContact) {
      if (
        !this.cloudKitchen.contact.person ||
        !this.cloudKitchen.contact.email ||
        !this.cloudKitchen.contact.mobile
      ) {
        return;
      }
      this.showContact = false;
      this.showCuisines = true;
      this.section = 'What cuisines you make?';
    } else if (this.showCuisines) {
      if (
        !this.cloudKitchen.cuisines ||
        this.cloudKitchen.cuisines?.length === 0
      ) {
        return;
      }
      this.showCuisines = false;
      this.showDeliverySection = true;
      this.section = 'Packaging & Delivery';
    } else if (this.showDeliverySection) {
      this.showDeliverySection = false;
      this.showPartyOrderForm = true;
      this.section = 'Party Orders';
    } else if (this.showPartyOrderForm) {
      this.showPartyOrderForm = false;
      this.showServiceLocations = true;
      this.section = 'Select your service locations';
    } else if (this.showServiceLocations) {
      if (
        this.cloudKitchen.serviceAreas &&
        this.cloudKitchen.serviceAreas?.length > 0
      ) {
        this.saveKitchen();
      }
    }
  }

  goBack() {
    if (this.showServiceLocations) {
      this.section = 'Packaging & Delivery';
      this.showDeliverySection = true;
      this.showServiceLocations = false;
    }
    if (this.showPartyOrderForm) {
      this.section = 'Party Orders';
      this.showDeliverySection = true;
      this.showServiceLocations = false;
    } else if (this.showDeliverySection) {
      this.section = 'Brief description about your kitchen';
      this.showDescription = true;
      this.showDeliverySection = false;
    } else if (this.showDescription) {
      this.section = 'What cuisines you make?';
      this.showDescription = false;
      this.showCuisines = true;
    } else if (this.showCuisines) {
      this.section = 'Your contact information';
      this.showContact = true;
      this.showCuisines = false;
    } else if (this.showContact) {
      this.section = 'Where is your kitchen located?';
      this.showKitchenAddress = true;
      this.showContact = false;
    } else if (this.showKitchenAddress) {
      this.showKitchenName = true;
      this.section = 'Whats your kitchen name?';
      this.showKitchenAddress = false;
    }
  }

  handleActive(e: any) {
    this.cloudKitchen.active = e.currentTarget.checked;
  }

  handleOpen(e: any) {
    this.cloudKitchen.open = e.currentTarget.checked;
  }

  handleDelivery(e: any) {
    this.doDelivery = e.currentTarget.checked;
  }

  handlePartyOrders(e: any) {
    this.cloudKitchen.doPartyOrders = e.currentTarget.checked;
  }

  onSelectAddress(address: Address) {
    this.cloudKitchen.address = address;
  }

  onSearchPostcodeDistrict() {
    var query: PostcodeDistrictQuery = {};
    query.coverage = this.searchTextPostcodeDistrict;
    let observable = this.locationService.fetchPostcodeDistricts(query);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.postcodeDistricts = data;
      },
      error: (err) => {
        console.error('Errors while fetching cuisines.' + JSON.stringify(err));
        this.errorMessage = err.error.detail;
      },
    });
  }

  onSelectServiceLocation(pd: PostcodeDistrict) {
    let found = false;
    if (!this.cloudKitchen.serviceAreas) {
      this.cloudKitchen.serviceAreas = [];
    }
    for (var i = 0; i < this.cloudKitchen.serviceAreas.length; i++) {
      var sl = this.cloudKitchen.serviceAreas[i];
      if (sl === pd.prefix) {
        found = true;
      }
    }
    if (!found) {
      this.cloudKitchen.serviceAreas.push(pd.prefix);
    }
  }

  unSelectServiceLocation(pd: string) {
    if (!this.cloudKitchen.serviceAreas) {
      this.cloudKitchen.serviceAreas = [];
    }
    for (var i = 0; i < this.cloudKitchen.serviceAreas.length; i++) {
      var sl = this.cloudKitchen.serviceAreas[i];
      if (sl === pd) {
        this.cloudKitchen.serviceAreas.splice(i, 1);
        break;
      }
    }
  }

  clearSearchPostcodeDistrict() {
    this.postcodeDistricts = [];
    this.searchTextPostcodeDistrict = undefined;
  }

  selectActiveLayout(component: string) {
    this.activeLayout = component;
    this.leafTemplate = component;
  }

  saveKitchen() {
    console.log('Saving kitchen ' + JSON.stringify(this.cloudKitchen));
    let observable = this.kitchenService.saveKitchen(this.cloudKitchen);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        this.saveKitchenStatus = true;
        this.activeLayout = 'Home';
        this.cloudKitchen = e;
        this.notification = "Your changes are saved";
      },
      error: (err) => {
        console.error('Errors during saving kitchen. ' + JSON.stringify(err));
        this.saveKitchenStatus = false;
        this.activeLayout = 'Home';
      },
    });
  }

  removeKeyword(keyword: string) {
    if ( this.cloudKitchen){
      if ( this.cloudKitchen.keywords){
        for (var i = 0; i < this.cloudKitchen.keywords.length; i++) {
          var kw = this.cloudKitchen.keywords[i];
          if (kw === keyword) {
            this.cloudKitchen.keywords.splice(i, 1);
            break;
          }
        }
      }
    }
  }
  
  addNewKeyword(){
    if ( this.cloudKitchen){
      if ( !this.cloudKitchen.keywords){
        this.cloudKitchen.keywords = [];
      }
      if ( this.cloudKitchen.keywords){
        var found = false;
        for (var i = 0; i < this.cloudKitchen.keywords.length; i++) {
          var kw = this.cloudKitchen.keywords[i];
          if (kw === this.keyword) {
            found = true;
            break;
          }
        }
        if (! found){
          this.cloudKitchen.keywords.push(this.keyword);
          this.keyword = "";
        }
      }
    }
  }

  closeNotification(){
    this.notification = null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
