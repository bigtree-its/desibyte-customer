import { DecimalPipe, Location } from '@angular/common';
import { Component, inject, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { User } from 'src/app/model/all-auth';
import {
  KitchenOrder,
  KitchenOrderProfileResponse,
  KitchenOrderTracking,
} from 'src/app/model/all-food-supplier';
import { AccountService } from 'src/app/services/auth/account.service';
import { SupplierOrderService } from 'src/app/services/supplier/supplier-order.service';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent {
  actionOnOrder: KitchenOrder;
  selectedPeriod: string = 'Today';
  periods: string[] = ['Today', 'Week', 'Month'];
  statuses: string[] = ['All', 'Open', 'Completed', 'Ready', 'Cancelled'];
  ELEMENT_DATA: KitchenOrder[] = [];

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
  weeklyOrders: KitchenOrder[] = [];
  monthlyOrders: KitchenOrder[] = [];
  todayOrders: KitchenOrder[] = [];
  loginSessionJson: string;
  action: any;
  profile: KitchenOrderProfileResponse;
  ordersToView: KitchenOrder[];

  myOrders$: Observable<KitchenOrder[]>;
  filter = new FormControl('', { nonNullable: true });
  decimalPipe = inject(DecimalPipe);
  viewOrder: KitchenOrder;

  constructor(
    private _location: Location,
    private router: Router,
    private orderSvc: SupplierOrderService,
    private accountSvc: AccountService,
    private modalSvc: NgbModal
  ) {}

  ngOnInit() {
    this.orderSvc.orderSubject$.subscribe((e) => {
      this.profile = e;
      if (e !== null && e !== undefined) {
        this.ordersToView = this.profile.today;
      } else {
        console.log('Subscribed orders are empty');
        var user: User = this.accountSvc.getCurrentUser();
        console.log('user logged in.. fetching orders..');
        if (user !== null && user !== undefined) {
          this.orderSvc.getProfile(user.email, user._id).subscribe((e) => {
            this.profile = e;
            if (e !== null && e !== undefined) {
               if (this.profile.today && this.profile.today.length > 0){
                const sortedArray = this.profile.today.slice().sort((a, b) => {
                  return (
                    <any>new Date(b.dateCreated) - <any>new Date(a.dateCreated)
                  );
                });
                this.orders = sortedArray;
                this.myOrders$ = this.filter.valueChanges.pipe(
                  startWith(''),
                  map((text) => this.search(text, this.decimalPipe))
                );
               }
            }
          });
        }
      }
    });
    // var chefOrderProfile = sessionStorage.getItem("chef-order-profile");
    // if ( chefOrderProfile !== null && chefOrderProfile !== undefined){
    //   this.profile = JSON.parse(chefOrderProfile);
    // }
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

  openOrder(order: KitchenOrder) {
    sessionStorage.setItem('chef-single-order', JSON.stringify(order));
    this.router.navigate(['orders', order.reference]).then();
  }

  groupOrders() {
    let today: Date = new Date();
    today.setHours(0, 0, 0, 0);
    let dayOfWeekNumber: number = today.getDay();
    let endDays: number = 7 - dayOfWeekNumber;
    var weekEnd: Date = this.addDays(today, endDays);
    weekEnd.setHours(0, 0, 0, 0);
    for (var i = 0; i < this.orders.length; i++) {
      var order: KitchenOrder = this.orders[i];
      let orderDate: Date = new Date(order.dateCreated);
      orderDate.setHours(0, 0, 0, 0);
      if (
        orderDate.getTime() <= weekEnd.getTime() &&
        orderDate.getTime() >= today.getTime()
      ) {
        this.weeklyOrders.push(order);
      }
      if (orderDate.getTime() === today.getTime()) {
        this.todayOrders.push(order);
      }
    }
  }

  addDays(theDate: Date, days: number): Date {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  selectPeriodEvent(event) {}

  selectPeriod(period: string) {
    if (period === 'Today') {
      this.dataSource = this.todayOrders;
    }
    if (period === 'This Week') {
      this.dataSource = this.weeklyOrders;
    }
    if (period === 'This Month') {
      this.dataSource = this.monthlyOrders;
    }
    if (period === 'Last Month') {
      // TODO
    }
    this.selectedPeriod = period;
  }

  displayOrders(orders: KitchenOrder[], period) {
    this.ordersToView = orders;
    this.selectedPeriod = period;
  }

  selectStatus(event) {
    if (event.value === 'Open') {
    }
  }

  open(order: KitchenOrder) {
    this.viewOrder = order;
  }


  openActionConfirmation(content, size, action) {
    this.action = action;
    this.modalSvc
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: size })
      .result.then(
        (result) => {},
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openActionModal(order: KitchenOrder, content) {
    const modalRef = this.modalSvc.open(content);
    modalRef.componentInstance.order = order;
  }

  goBack() {
    this._location.back();
  }

  updateStatus(order: KitchenOrder, action: string) {
    var status;
    switch (action) {
      case 'Accept': {
        status = 'ACCEPTED';
        break;
      }
      case 'Reject': {
        status = 'REJECTED';
        break;
      }
      case 'Refund': {
        status = 'REFUNDED';
        break;
      }
      case 'Complete': {
        status = order.serviceMode === 'COLLECTION' ? 'COLLECTED' : 'DELIVERED';
        break;
      }
    }
    order.status = status;
    var tracking: KitchenOrderTracking = {
      reference: order.reference,
      status: status,
      _id: '',
      orderId: order._id,
      dateAccepted: undefined,
      datePaid: undefined,
      dateCancelled: undefined,
      dateDelivered: undefined,
      dateCollected: undefined,
      dateRefunded: undefined,
    };
    this.orderSvc.updateStatus(tracking).subscribe(
      (data: KitchenOrderTracking) => {
        order.status = data.status;
      },
      (err) => {
        window.alert('Error when ' + status + ' the order');
      }
    );
  }

  onAction(order: KitchenOrder, e) {
    this.updateStatus(order, e.target.value);
    this.modalSvc.dismissAll();
  }
}
