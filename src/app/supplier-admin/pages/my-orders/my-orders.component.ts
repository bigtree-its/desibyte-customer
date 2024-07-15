import { DecimalPipe, Location } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PipeTransform,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import {
  KitchenOrder,
  KitchenOrderProfileResponse,
  KitchenOrderTracking,
  Note,
} from 'src/app/model/all-food-supplier';
import { AccountService } from 'src/app/services/auth/account.service';
import { SupplierOrderService } from 'src/app/services/supplier/supplier-order.service';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { CloudKitchenService } from 'src/app/services/foods/cloudkitchen.service';
import { CloudKitchen } from 'src/app/model/all-foods';
import { faArrowLeft, faChevronDown, faChevronUp, faFaceSmile, faPeopleArrows, faStar } from '@fortawesome/free-solid-svg-icons';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();
  actionOnOrder: KitchenOrder;
  selectedPeriod: string = 'Today';
  periods: string[] = ['Today', 'Week', 'Month'];
  statuses: string[] = ['All', 'Open', 'Completed', 'Ready', 'Cancelled'];
  ELEMENT_DATA: KitchenOrder[] = [];

  errors: any;
  error: boolean;
  errorMessage: any;
  loading: boolean = false;
  orderReference: any;
  notification: string;
  declineReason: string;

  displayedColumns: string[] = [
    'Reference',
    'Date',
    'Customer',
    'Amount',
    'Status',
    'Action',
  ];
  dataSource: any;
  orders: KitchenOrder[] = [];
  loginSessionJson: string;
  action: any;
  ordersToView: KitchenOrder[];

  myOrders$: Observable<KitchenOrder[]>;
  filter = new FormControl('', { nonNullable: true });
  decimalPipe = inject(DecimalPipe);
  viewOrder: KitchenOrder;
  cloudKitchen: CloudKitchen;
  orderProfile: KitchenOrderProfileResponse;

  faArrowLeft = faArrowLeft;
  faStar = faStar;
  faPeopleArrows = faPeopleArrows;
  faFaceSmile = faFaceSmile;
  chevronDown = faChevronDown;
  chevronUp = faChevronUp;


  openOrder: boolean = true;
  showOrder: boolean = false;

  openItems: boolean = true;
  showItems: boolean = false;
  filteredStatus: string;

  constructor(
    private orderSvc: SupplierOrderService,
    private kitchenService: CloudKitchenService,
    private modalSvc: NgbModal
  ) { }

  ngOnInit() {
    this.orderSvc.orderSubject$.subscribe((e) => {
      this.orderProfile = e;
      if (this.orderProfile) {
        this.ordersToView = this.orderProfile.today;
      } else {
        console.log('Subscribed orders are empty');
        this.cloudKitchen = this.kitchenService.getData();
        this.kitchenService.cloudKitchenSubject$.subscribe(e => {
          if (e) {
            this.cloudKitchen = e;
            this.fetchOrders();
          }
        });
      }
    });
  }

  fetchOrders() {
    let observable = this.orderSvc.getProfile(this.cloudKitchen._id);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        this.orderProfile = e;
        this.filteredStatus = 'All'
        if (this.orderProfile.today && this.orderProfile.today.length > 0) {
          this.prepareOrderToView(this.orderProfile.today);
        } else if (this.orderProfile.sevenDays && this.orderProfile.sevenDays.length > 0) {
          this.prepareOrderToView(this.orderProfile.sevenDays);
        } else if (this.orderProfile.month && this.orderProfile.month.length > 0) {
          this.prepareOrderToView(this.orderProfile.month);
        }
      },
      error: (err) => {
        console.error(
          'Errors during loading orders for kitchen. ' + JSON.stringify(err)
        );
      },
    });
  }

  private prepareOrderToView(orders: KitchenOrder[]) {
    const sortedArray = orders.slice().sort((a, b) => {
      return <any>new Date(b.dateCreated) - <any>new Date(a.dateCreated);
    });
    this.orders = sortedArray;
    this.myOrders$ = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => this.search(text, this.decimalPipe))
    );
  }

  search(text: string, pipe: PipeTransform): KitchenOrder[] {
    return this.orders?.filter((order) => {
      const term = text.toLowerCase();
      return (
        order.reference.toLowerCase().includes(term) ||
        pipe.transform(order.status).includes(term) ||
        pipe.transform(order.total).includes(term)
      );
    });
  }


  open(order: KitchenOrder) {
    this.viewOrder = order;
  }

  openActionConfirmation(content, size, action) {
    this.action = action;
    this.modalSvc
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: size })
      .result.then(
        (result) => { },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  closeModal() {
    this.modalSvc.dismissAll();
  }

  openActionModal(order: KitchenOrder, content) {
    const modalRef = this.modalSvc.open(content);
    modalRef.componentInstance.order = order;
  }

  goBack() {
    this.viewOrder = null;
  }

  performAction(action: string) {
    this.loading = true;

    if (action === 'Decline') {
      var note: Note = {};
      note.dateTime = new Date();
      note.message = this.declineReason;
      if (!this.viewOrder.kitchenNotes) {
        this.viewOrder.kitchenNotes = [];
      }
      this.viewOrder.kitchenNotes.push(note);
    }
    var performed = this.getActionPerformed(action);
    let observable = this.orderSvc.action(this.viewOrder.reference, action);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e) => {
        this.viewOrder = e;
        this.notification =
          'Order ' + this.viewOrder.reference + ' has been updated with status ' + performed;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Errors from reset submit.' + JSON.stringify(err));
        if (Utils.isJsonString(err)) {
          this.notification =
            'There was an issue when performing your update on the order. Please contact custoer support quoting order reference ' + this.viewOrder.reference;
        }
      },
    });
  }

  obtainDeclineReason(content) {
    this.modalSvc
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => { },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  getActionPerformed(action: string) {
    var performed;
    switch (action) {
      case 'Accept': {
        performed = 'Accepted';
        break;
      }
      case 'Decline': {
        performed = 'Declined';
        break;
      }
      case 'Refund': {
        performed = 'Refunded';
        break;
      }
      case 'Ready': {
        performed = 'Ready';
        break;
      }
      case 'Complete': {
        performed = this.viewOrder.serviceMode === 'COLLECTION' ? 'Collected' : 'Delivered';
        break;
      }
      return performed;
    }

  }

  showOrders(period: string) {
    if (period === 'Today') {
      this.selectedPeriod = period;
      this.prepareOrderToView(this.orderProfile.today)
    } else if (period === 'Week') {
      this.selectedPeriod = period;
      this.prepareOrderToView(this.orderProfile.sevenDays)
    } else if (period === 'Month') {
      this.selectedPeriod = period;
      this.prepareOrderToView(this.orderProfile.month)
    }
  }

  filterStatus(status: string) {
    let filteredOrderes = [];
    if (status !== 'All') {
      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].status === status) {
          filteredOrderes = [...filteredOrderes, this.orders[i]];
        }
      }
      this.prepareOrderToView(filteredOrderes)
    } else {
      this.showOrders(this.selectedPeriod);
    }
    this.filteredStatus = status;

  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
