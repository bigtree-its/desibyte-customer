import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faFaceSmile, faMinus, faPeopleArrows, faPlus, faStar } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Errors } from 'src/app/model/all-auth';
import { FoodOrder, LocalChef } from 'src/app/model/all-foods';
import { PaymentIntentResponse } from 'src/app/model/common';
import { ToastService } from 'src/app/services/common/toast.service';
import { Utils } from 'src/app/services/common/utils';
import { ChefService } from 'src/app/services/foods/chef.service';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';


@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent implements OnInit, OnDestroy{
 

  // Dependencies
  activatedRoute = inject(ActivatedRoute);
  orderService = inject(FoodOrderService);
  supplierService = inject(ChefService);
  toastService = inject(ToastService);

  destroy$ = new Subject<void>();
  stripeElements: any;
  cardElement: any;
  paymentIntent: PaymentIntentResponse;
  errors: Errors = { errors: {} };
  errorMessage: any;
  order: FoodOrder;
  supplier: LocalChef;


  faStar = faStar;
  faPeopleArrows = faPeopleArrows;
  faFaceSmile = faFaceSmile;
  faPlus = faPlus;
  faMinus = faMinus;

  openSupplier: boolean = true;
  showSupplier: boolean = false;

  openOrder: boolean = true;
  showOrder: boolean = false;

  openItems: boolean = true;
  showItems: boolean = false;
  error = false;
  insufficient_data: boolean;


  ngOnInit(): void {
    this.error = false;
    
    var intentId = this.activatedRoute.snapshot.queryParamMap.get('intent');
    var ref = this.activatedRoute.snapshot.queryParamMap.get('ref');
    if ( Utils.isEmpty(ref) && Utils.isEmpty(intentId)){
      this.insufficient_data = true;
    }else{
      this.insufficient_data = false;
      if (!Utils.isEmpty(intentId)) {
        let observable = this.orderService.retrieveSinglePaymentIntent(intentId);
        observable.pipe(takeUntil(this.destroy$)).subscribe({
          next: (e) => {
            this.paymentIntent = e;
            console.log('Payment Intent ' + JSON.stringify(e));
            if (Utils.isValid(e)) {
              if (this.paymentIntent.status === 'succeeded') {
                this.error = true;
                this.errorMessage = 'This order has already been paid';
                this.toastService.warning('This order has already been paid');
              }
              if ( Utils.isEmpty(ref)){
                this.retrieveOrder(this.paymentIntent.orderReference);
              }
            } else {
              this.error = true;
              this.errorMessage =
                'There is some issue retrieving this order. Please contact customer support';
              this.toastService.warning(
                'There is some issue retrieving this order. Please contact customer support'
              );
            }
          },
          error: (err) => {
            this.error = true;
            console.error(
              'Error occurred when retrieving payment intent.' +
                JSON.stringify(err)
            );
            this.errors = err;
            if (Utils.isJsonString(err)) {
              this.errorMessage = err.error.detail;
              this.toastService.info(this.errorMessage);
            } else {
              this.errorMessage =
                'There is some issue retrieving this order. Please contact customer support';
            }
          },
        });
      } 
      if ( Utils.isEmpty(ref)){
        this.retrieveOrder(ref);
      }
    }
    
  }

  retrieveOrder(orderReference: string) {
    let observable = this.orderService.retrieveSingleOrder(orderReference, null);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        if (Utils.isValid(e)) {
          this.order = e[0];
          console.log('Customer order ' + JSON.stringify(e));
          this.retrieveSupplier(this.order.supplier._id);
        }
      },
      error: (err) => {
        console.error(
          'Error occurred when retrieving customer order.' + JSON.stringify(err)
        );
        this.errors = err;
        this.error = true;
        this.errorMessage = 'Error occurred when retrieving customer order';
        this.toastService.warning(
          'Error occurred when retrieving customer order.'
        );
        if (Utils.isJsonString(err)) {
          this.errorMessage = err.error.detail;
          this.error = true;
        }
      },
    });
  }

  retrieveSupplier(_id: string) {
    let observable = this.supplierService.retrieveSupplier(_id);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        this.supplier = e;
        console.log('Supplier ' + JSON.stringify(e));
      },
      error: (err) => {
        console.error(
          'Error occurred when retrieving supplier.' + JSON.stringify(err)
        );
        this.errors = err;
        this.error = true;
        this.errorMessage = err.error.detail;
        this.toastService.info(this.errorMessage);
      },
    });
  }

  openCloseSupplier() {
    this.openSupplier = !this.openSupplier; //not equal to condition
    this.showSupplier = !this.showSupplier;
    this.openOrder = false; //not equal to condition
    this.showOrder = false;
    this.openItems = false; //not equal to condition
    this.showItems = false;
  }
  openCloseOrder() {
    this.openOrder = !this.openOrder; //not equal to condition
    this.showOrder = !this.showOrder;
    this.openSupplier = false; //not equal to condition
    this.showSupplier = false;
    this.openItems = false; //not equal to condition
    this.showItems = false;
  }
  openCloseItems() {
    this.openItems = !this.openItems; //not equal to condition
    this.showItems = !this.showItems;
    this.openSupplier = false; //not equal to condition
    this.showSupplier = false;
    this.openOrder = false; //not equal to condition
    this.showOrder = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
