import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faArrowLeft,
  faBox,
  faChevronDown,
  faChevronUp,
  faPersonBiking,
} from '@fortawesome/free-solid-svg-icons';
import {
  Address,
  PaymentIntentResponse,
  RapidApiByPostcodeResponse,
  RapidApiByPostcodeResponseSummary,
} from 'src/app/model/common';
import { CloudKitchen, FoodOrder } from 'src/app/model/all-foods';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/model/all-auth';
import { RapidApiService } from 'src/app/services/common/rapid-api.service';
import { StripeService } from 'src/app/services/common/stripe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';
import { AccountService } from 'src/app/services/auth/account.service';
import { Utils } from 'src/app/services/common/utils';
import { CloudKitchenService } from 'src/app/services/foods/cloudkitchen.service';

@Component({
  selector: 'app-food-checkout',
  templateUrl: './food-checkout.component.html',
  styleUrls: ['./food-checkout.component.css'],
})
export class FoodCheckoutComponent implements OnDestroy {
  faPersonBiking = faPersonBiking;
  faBox = faBox;
  faArrowLeft = faArrowLeft;
  chevronDown = faChevronDown;
  chevronUp = faChevronUp;

  openItems: boolean = false;
  yourDetails: boolean = false;
  yourAddress: boolean = false;
  enablePayButton: boolean = false;

  customerMobile: string = '';
  customerEmail: string = '';
  customerName: string = '';
  notesToCloudKitchen: string = '';

  divHeader: string = '';
  nextButtonText: string = 'Next';
  showHomeScreen: boolean = true;
  showCustomerDetailsSection: boolean = false;
  showServiceModeSection: boolean = false;
  showItemsSection: boolean = false;
  showPaymentSection: boolean = false;
  showStripeSection: boolean = false;
  showPlaceOrderButton: boolean = false;

  serviceMode: string = 'COLLECTION';
  customerAddress: Address;
  addressLookupPostcode: string;
  hidePostcodeLookupForm: boolean;
  postcodeAddressList: RapidApiByPostcodeResponseSummary[];
  rapidApiByPostcodeResponseSummary: RapidApiByPostcodeResponseSummary;
  postcode: string;
  addressSelected: boolean;
  lookupAddress: boolean = true;

  cartTotal: number = 0;
  order: FoodOrder;
  kitchen: CloudKitchen;
  price: number = 0.0;

  stripeElements: any;
  cardElement: any;
  paymentIntent: PaymentIntentResponse;
  destroy$ = new Subject<void>();
  customerLoggedIn: boolean;
  customer: User;
  orderSubmitted: boolean = false;
  showOrderConfirmation: boolean = false;
  loading: any;

  constructor(
    private rapidApiService: RapidApiService,
    private stripeService: StripeService,
    private _location: Location,
    private modalService: NgbModal,
    private orderService: FoodOrderService,
    private kitchenService: CloudKitchenService,
    private accountService: AccountService,
    private router: Router,
    private titleService: Title
  ) {}

  public loadStripe$: Observable<any> = this.stripeService.LoadStripe();

  ngOnInit(): void {
    this.loading = false;
    this.titleService.setTitle('Checkout');
    this.loadStripe$.subscribe((s) => {
      console.log('Loaded stripe: ' + s);
    });

    this.kitchenService.getData();
    this.kitchenService.cloudKitchenSubject$.subscribe(e=>{
      this.kitchen = e;
    });
    this.orderService.getData();
    this.orderService.foodOrderSubject$.subscribe({
      next: (value) => {
        console.log('OrderSubject rx emitted : ' + JSON.stringify(value));
        var FoodOrder: FoodOrder = value;
        this.extractOrder(FoodOrder);
      },
      error: (err) => console.error('OrderSubject emitted an error: ' + err),
      complete: () =>
        console.log('OrderSubject emitted the complete notification'),
    });

    this.accountService.getData();
    this.accountService.loginSession$.subscribe({
      next: (value) => {
        console.log('Customer subject ' + JSON.stringify(value));
        this.customer = value;
        if (this.customer !== null && this.customer !== undefined) {
          this.customerName = this.customer.firstName + this.customer.lastName;
          this.customerEmail = this.customer.email;
          this.customerMobile = this.customer.mobile;
          this.showCustomerDetailsSection = true;
          this.showHomeScreen = false;
        } else {
          this.showHomeScreen = true;
          this.showCustomerDetailsSection = false;
        }
      },
      error: (err) => console.error('CustomerSubject emitted an error: ' + err),
      complete: () =>
        console.log('CustomerSubject emitted the complete notification'),
    });
  }

  openCloseItems() {
    this.openItems = !this.openItems;
    this.yourDetails = false;
    this.yourAddress = false;
  }
  openCloseDetails() {
    this.yourDetails = !this.yourDetails;
    this.openItems = false;
    this.yourAddress = false;
  }
  openCloseAddress() {
    this.yourAddress = !this.yourAddress;
    this.openItems = false;
    this.yourDetails = false;
  }

  canShowPlaceOrderButton() {
    return this.validateCustomerDetails() && this.validateServiceMode();
  }

  extractOrder(theOrder: FoodOrder) {
    console.log('Order status ' + theOrder.status);
    if (
      Utils.isValid(theOrder) &&
      (theOrder.status === 'Completed' || theOrder.status === 'Paid')
    ) {
      return;
    }
    this.order = theOrder;
    if (theOrder) {
      this.cartTotal = theOrder.subTotal;
      this.notesToCloudKitchen = theOrder.notes;
      if (
        theOrder.items === null ||
        theOrder.items === undefined ||
        theOrder.items.length === 0
      ) {
        if (this.kitchen ) {
          this.router.navigate(['/cloud-kitchens', this.kitchen._id]).then();
        }
      }
    } else {
      this.order = this.getOrder();
      if (!this.order) {
        this.router.navigateByUrl('/');
      } else {
        this.cartTotal = this.order.subTotal;
      }
    }
  }
  ngAfterViewInit(): void {
    // if (this.stripeService.stripe === undefined) {
    //   this.stripeService.getStripe().subscribe((s) => {
    //     console.log(
    //       'Initializing Stripe card element inside form: ' +
    //       JSON.stringify(this.stripeService.stripe)
    //     );
    //   });
    // }
  }
  validateCustomerDetails(): boolean {
    if (
      Utils.isEmpty(this.customerName) ||
      Utils.isEmpty(this.customerEmail) ||
      Utils.isEmpty(this.customerMobile)
    ) {
      return false;
    }
    return true;
  }

  validateServiceMode(): boolean {
    if (
      this.serviceMode === 'DELIVERY' &&
      this.addressSelected &&
      Utils.isValid(this.customerAddress) &&
      !Utils.isEmpty(this.customerAddress.addressLine1)
    ) {
      return true;
    }
    if (this.serviceMode === 'COLLECTION') {
      return true;
    }
    return false;
  }

  placeOrder(content) {
    window.alert('Placing order '+ JSON.stringify(this.order))
    this.loading = true;
    this.order.customer.name = this.customerName;
    this.order.customer.email = this.customerEmail;
    this.order.customer.mobile = this.customerMobile;
    this.order.customer.address = this.customerAddress;
    this.order.serviceMode = this.serviceMode;
    this.order.notes = this.notesToCloudKitchen;
    let observable = this.orderService.saveOrder(this.order);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        this.orderSubmitted = true;
        this.order = e;
        this.loading = false;
        if (content) {
          this.open(content);
        }
      },
      error: (err) => {
        console.error('Errors during saving order. ' + JSON.stringify(err));
        this.orderSubmitted = false;
      },
    });
  }

  orderConfirmed() {
    this.showCustomerDetailsSection = false;
    this.showServiceModeSection = false;
    this.showItemsSection = false;
    this.showPaymentSection = false;
    this.showOrderConfirmation = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectPickup() {
    this.serviceMode = 'COLLECTION';
    this.order.serviceMode = 'COLLECTION';
    if (this.order.deliveryFee > 0) {
      this.order.deliveryFee = 0;
      this.order.total = this.order.total - this.kitchen.deliveryFee;
    }
  }

  selectDelivery() {
    this.serviceMode = 'DELIVERY';
    this.order.serviceMode = 'DELIVERY';
    if ( this.kitchen){
      if ( this.kitchen.freeDeliveryOver > 0){
        if ( this.order.total >= this.kitchen.freeDeliveryOver){
          this.order.deliveryFee = 0;
        }else{
          var deliveryQualify = this.kitchen.freeDeliveryOver - this.order.total;
          if ( deliveryQualify > 0){
            
          }
          this.order.deliveryFee = this.kitchen.deliveryFee;
        }
      }
    }
    this.order.total = this.order.total + this.kitchen.deliveryFee;
  }

  getAddress(): string {
    var address: string = '';
    if (this.kitchen !== null && this.kitchen !== undefined) {
      return Utils.getCloudKitchenAddress(this.kitchen);
    }
    return address;
  }

  getOrder(): FoodOrder {
    var orderJson = localStorage.getItem('order');
    var order: FoodOrder = null;
    if (orderJson !== null && orderJson !== undefined) {
      order = JSON.parse(orderJson);
    }
    return order;
  }

  getCloudKitchen(): CloudKitchen {
    var chefJson = localStorage.getItem('cloud-kitchen');
    var chef: CloudKitchen = null;
    if (chefJson !== null && chefJson !== undefined) {
      chef = JSON.parse(chefJson);
    }
    return chef;
  }

  onSelectAddress(address: Address) {
    if (address) {
      this.customerAddress = address;
      this.addressSelected = true;
      this.lookupAddress = false;
    }
  }

  onSubmitPostcodeLookup(postcodeLookupForm: NgForm) {
    console.log('Search address form submitted..');
    if (postcodeLookupForm.valid) {
      this.doPostcodeLookup(this.addressLookupPostcode);
    }
  }

  doPostcodeLookup(postcode: string) {
    if (postcode === null && postcode === undefined) {
      return;
    }
    this.rapidApiService
      .lookupAddresses(this.addressLookupPostcode.trim())
      // .pipe(first())
      .subscribe(
        (data: RapidApiByPostcodeResponse) => {
          this.postcodeAddressList = data.Summaries;
          this.addressSelected = false;
          console.log(
            'Address Lookup response ' +
              JSON.stringify(this.postcodeAddressList)
          );
        },
        (error) => {
          console.log(
            'Address Lookup resulted an error.' + JSON.stringify(error)
          );
        }
      );
  }

  onSelectDeliveryAddress(selectAddress: RapidApiByPostcodeResponseSummary) {
    var city = selectAddress.Place.split(/[\s ]+/).pop();
    this.customerAddress = {
      city: city,
      addressLine1: selectAddress.StreetAddress,
      addressLine2: selectAddress.Place,
      country: 'UK',
      postcode: this.addressLookupPostcode,
      latitude: '',
      longitude: '',
    };
    this.addressSelected = true;
    this.lookupAddress = false;
  }

  showAddressLookup() {
    this.lookupAddress = true;
    this.customerAddress = undefined;
  }

  findAddress() {
    if (
      this.addressLookupPostcode !== null &&
      this.addressLookupPostcode !== undefined &&
      this.addressLookupPostcode.length > 2
    ) {
      this.doPostcodeLookup(this.addressLookupPostcode);
    }
  }

  cancelAddressLookup() {
    this.lookupAddress = false;
  }

  back() {
    this._location.back();
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.loading = false;
        },
        (reason) => {
          this.loading = false;
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  close() {
    this.modalService.dismissAll();
    this.loading = false;
  }

  goback() {
    this._location.back();
  }
}
