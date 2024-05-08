import { Component, OnDestroy, OnInit, PipeTransform, inject } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft, faChevronDown, faChevronUp, faFaceSmile, faPeopleArrows, faStar } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { User } from 'src/app/model/all-auth';
import { FoodOrder, LocalChef, OrderSearchQuery } from 'src/app/model/all-foods';
import { PaymentIntentResponse } from 'src/app/model/common';
import { AccountService } from 'src/app/services/auth/account.service';
import { ToastService } from 'src/app/services/common/toast.service';
import { Utils } from 'src/app/services/common/utils';
import { ChefService } from 'src/app/services/foods/chef.service';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit, OnDestroy {

  // inject dependencies
  accountService = inject(AccountService);
  orderService = inject(FoodOrderService);
  toastService = inject(ToastService);
  supplierService = inject(ChefService);
  router = inject(Router);
  modalService = inject(NgbModal);
  decimalPipe = inject(DecimalPipe);

  user: User;
  destroy$ = new Subject<void>();
  orders: FoodOrder[] = [];
  myOrders$: Observable<FoodOrder[]>;
  filter = new FormControl('', { nonNullable: true });

  viewOrder: FoodOrder;
  faArrowLeft = faArrowLeft;
  faStar = faStar;
  faPeopleArrows = faPeopleArrows;
  faFaceSmile = faFaceSmile;
  chevronDown = faChevronDown;
  chevronUp = faChevronUp;


  openSupplier: boolean = true;
  showSupplier: boolean = false;

  openOrder: boolean = true;
  showOrder: boolean = false;

  openItems: boolean = true;
  showItems: boolean = false;
  supplier: LocalChef;
  errors: any;
  error: boolean;
  errorMessage: any;
  loading: boolean = false;
  orderRefernce: any;

  constructor() {
	}

  ngOnInit() {
    console.log('Init. Customer orders');
    this.accountService.getData();
    this.accountService.loginSession$.subscribe({
      next: (value) => {
        this.user = value;
        console.log('CustomerObject. emitted ' + JSON.stringify(value));
        this.fetchFoodOrders();
      },
      error: (err) => console.error('CustomerObject emitted an error: ' + err),
      complete: () =>
        console.log('CustomerObject emitted the complete notification'),
    });
  }

  fetchFoodOrders() {
    if (Utils.isValid(this.user)) {
      let orderSearchQuery: OrderSearchQuery = {
        customerEmail: this.user.email,
      };
      let observable = this.orderService.getFoodOrders(orderSearchQuery);
      observable.subscribe((e) => {
        if (Utils.isValid(e)) {
          this.orders = e;
          console.log('Orders ' + this.orders.length);
          if ( this.orders){
            this.myOrders$ = this.filter.valueChanges.pipe(
              startWith(''),
              map((text) => this.search(text, this.decimalPipe)),
            );
            console.log('My Orders$ '+ JSON.stringify(this.myOrders$))
          }
        }
      });
    }
  }

  search(text: string, pipe: PipeTransform): FoodOrder[] {
    return this.orders?.filter((order) => {
      const term = text.toLowerCase();
      return (
        order.reference.toLowerCase().includes(term) ||
        pipe.transform(order.status).includes(term) || 
        pipe.transform(order.total).includes(term) 
      );
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

  open(order: FoodOrder) {
    this.viewOrder = order;
    this.retrieveSupplier(order.supplier._id);
  }

  goBack() {
    this.viewOrder = null;
  }

  makePayment(content) {
    if (content) {
      this.openPayment(content);
    }
  }

  openPayment(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => { },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  closePayment() {
    this.modalService.dismissAll();
  }

  submit() {
    this.performAction("Submit");
  }

  private performAction(action: string) {
    this.loading = true;
    let observable = this.orderService.action(this.viewOrder.reference, action);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        if (action === 'Delete') {
          this.viewOrder = null;
        } else {
          this.viewOrder = e;
        }
        this.loading = false;
        this.toastService.success('Order has been ' + this.viewOrder.status);
      },
      error: (err) => {
        this.loading = false;
        console.error('Errors from reset submit.' + JSON.stringify(err));
        if (Utils.isJsonString(err)) {
          this.toastService.error(err.error.detail);
        }
      },
    });
  }

  cancel() {
    this.performAction("Cancel");
  }

  delete() {
    this.performAction("Delete");
  }

  update() { }

  pay() {
    let observable = this.orderService.fetchPaymentIntent(this.viewOrder.reference, null);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        if (Utils.isValid(e)) {
          var paymentIntent: PaymentIntentResponse[] = e;
          this.router.navigateByUrl("/make_payment?intent=" + paymentIntent[0].intentId);
        }
        console.log('Payment Intent ' + JSON.stringify(e));
      },
      error: (err) => {
        console.error(
          'Error occurred when retrieving payment intent.' + JSON.stringify(err)
        );
        this.errors = err;
        this.error = true;
        this.errorMessage = err.error.detail;
        this.toastService.info(this.errorMessage);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
}
