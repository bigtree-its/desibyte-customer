import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/model/all-auth';
import { Cuisine, CloudKitchen } from 'src/app/model/all-foods';
import { PostcodeDistrict } from 'src/app/model/common';
import { AccountService } from 'src/app/services/auth/account.service';
import { LocationService } from 'src/app/services/common/location.service';
import { Utils } from 'src/app/services/common/utils';
import { ProfileService } from 'src/app/services/supplier/profile.service';

@Component({
  selector: 'app-my-settings',
  templateUrl: './my-settings.component.html',
  styleUrls: ['./my-settings.component.css']
})
export class MySettingsComponent implements OnInit, OnDestroy {
  user: User;

  onSearchServiceLocation() {
    throw new Error('Method not implemented.');
  }

  showServiceLocations: any;
  serviceLocationSearchText: any;
  searchLocation: any;
  errorMessage: any;
  leafView: string = undefined;
  cuisines: Cuisine[];

  destroy$ = new Subject<void>();

  minimumOrder: any;
  partyOrders: any;
  minimumPartyOrder: any;
  delivery: any;
  deliveryFee: any;
  packagingFee: any;
  deliveryDistance: any;
  freeDeliveryOver: any;
  activeLayout: string;
  subLayout: string;

  editPersonal: boolean = false;
  name: string = '';
  mobile: string = '';
  kitchenName: string = '';
  editAddress: boolean;
  editSlots: boolean;
  editCuisines: boolean;
  editLocations: boolean;
  editGeneral: boolean;
  editKitchen: boolean;
  serviceAreaSearchErrorMessage: any;
  cloudKitchen: CloudKitchen;

  constructor(private router: Router,
    private accountService: AccountService,
    private profileSvc: ProfileService,
    private locationSvc: LocationService
  ) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.activeLayout = "Home";
    this.accountService.loginSession$.subscribe({
      next: (value) => {
        this.user = value;
        if ( this.user){
          let observable = this.profileSvc.fetchChef(this.user.email);
          observable.pipe(takeUntil(this.destroy$)).subscribe({
            next: (data) => {
              this.cloudKitchen = data;
            },
            error: (err) => {
              console.error('Errors while fetching MyBusiness.' + JSON.stringify(err));
              this.errorMessage = err.error.detail;
            },
          });
        }else{
          console.log('User not logged in')
        }
      },
      error: (err) => console.error('CustomerObject emitted an error: ' + err),
      complete: () =>
        console.log('CustomerObject emitted the complete notification'),
    });
    this.fetchCuisines();
  }


  private fetchCuisines() {
    let observable = this.profileSvc.fetchAllCuisine();
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.cuisines = data;
      },
      error: (err) => {
        console.error('Errors while fetching cuisines.' + JSON.stringify(err));
        this.errorMessage = err.error.detail;
      },
    });
  }

  selectActiveLayout(main: string, sub: string) {
    this.activeLayout = main;
    this.subLayout = sub;
    if (main !== "Home") {
      this.leafView = main;
    } else {
      this.leafView = undefined;
    }
  }

  editData(type: string) {
    switch (type) {
      case 'Personal':
        this.editPersonal = true;
        break;
      case 'Address':
        this.editAddress = true;
        break;
      case 'Cuisines':
        this.editCuisines = true;
        break;
      case 'Locations':
        this.editLocations = true;
        break;
      case 'Kitchen':
        this.editKitchen = true;
        break;
    }

  }
  cancelEdit() {
    this.editPersonal = false;
    this.editAddress = false;
    this.editCuisines = false;
    this.editKitchen = false;
    this.editGeneral = false;
    this.editLocations = false;
    this.editSlots = false;
  }

  submitPersonal() {
    if (Utils.isEmpty(this.cloudKitchen.name)) {
      this.errorMessage = 'Name is mandatory';
      return;
    }
    if (Utils.isEmpty(this.cloudKitchen.contact.email)) {
      this.errorMessage = 'Email is mandatory';
      return;
    }
    if (Utils.isEmpty(this.cloudKitchen.contact.mobile)) {
      this.errorMessage = 'Mobile is mandatory';
      return;
    }
    if (Utils.isEmpty(this.cloudKitchen.name)) {
      this.errorMessage = 'Kitchen Name is mandatory';
      return;
    }
    this.updateChef();
  }

  removeLocation(location: string) {
    for (var i = 0; i < this.cloudKitchen.serviceAreas.length; i++) {
      var l = this.cloudKitchen.serviceAreas[i];
      if (l === location) {
        this.cloudKitchen.serviceAreas.splice(i, 1);
      }
    }
  }

  onSelectCuisine(_t244: Cuisine) {
    let found = false;
    for (var i = 0; i < this.cloudKitchen.cuisines.length; i++) {
      var c = this.cloudKitchen.cuisines[i];
      if (c._id === _t244._id) {
        found = true;
      }
    }
    if (!found) {
      this.cloudKitchen.cuisines.push(_t244);
      this.updateChef();
    }

  }

  removeCuisine(_t252: Cuisine) {
    for (var i = 0; i < this.cloudKitchen.cuisines.length; i++) {
      var l = this.cloudKitchen.cuisines[i];
      if (l._id === _t252._id) {
        this.cloudKitchen.cuisines.splice(i, 1);
      }
    }
  }

  onSelectServiceLocation(_t170: PostcodeDistrict) {
    let found = false;
    for (var i = 0; i < this.cloudKitchen.serviceAreas.length; i++) {
      var l = this.cloudKitchen.serviceAreas[i];
      if (l === _t170.prefix) {
        found = true;
      }
    }
    if (!found) {
      this.cloudKitchen.serviceAreas.push(_t170.prefix);
    }

    this.updateChef();
  }

  submitAddress() {
    if (Utils.isEmpty(this.cloudKitchen.address.addressLine1)) {
      this.errorMessage = 'Address Line1 is mandatory';
      return;
    }
    if (Utils.isEmpty(this.cloudKitchen.address.addressLine2)) {
      this.errorMessage = 'Address Line2 is mandatory';
      return;
    }
    if (Utils.isEmpty(this.cloudKitchen.address.city)) {
      this.errorMessage = 'City is mandatory';
      return;
    }
    if (Utils.isEmpty(this.cloudKitchen.address.postcode)) {
      this.errorMessage = 'Postcode is mandatory';
      return;
    }
    this.updateChef();
  }

  submitKitchenSettings() {
    this.updateChef();
  }

  public updateChef() {
    let observable = this.profileSvc.updateChef(this.cloudKitchen);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.cloudKitchen = data;
        console.log('The updated chef: ' + JSON.stringify(data))
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Erros when updating chef.' + JSON.stringify(err))
        this.errorMessage = err.error.detail;
        this.cancelEdit();
      },
    });
  }

  onChangeKitchenStatus($event) {
    this.cloudKitchen.active = $event && $event.target && $event.target.checked;
  }

  onChangeDoDelivery($event) {
    this.cloudKitchen.doDelivery = $event && $event.target && $event.target.checked;
  }

  onChangeDoPartyOrder($event) {
    this.cloudKitchen.doPartyOrders = $event && $event.target && $event.target.checked;
  }

  submitLocations() {
    throw new Error('Method not implemented.');
  }


}
