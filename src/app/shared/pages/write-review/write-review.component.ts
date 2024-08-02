import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { Errors, User } from 'src/app/model/all-auth';
import { CloudKitchen } from 'src/app/model/all-foods';
import { Review } from 'src/app/model/common';
import { AccountService } from 'src/app/services/auth/account.service';
import { ReviewService } from 'src/app/services/common/review.service';
import { ToastService } from 'src/app/services/common/toast.service';
import { Utils } from 'src/app/services/common/utils';
import { CloudKitchenService } from 'src/app/services/foods/cloudkitchen.service';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.css'],
})
export class WriteReviewComponent implements OnInit, OnDestroy {
  faStar = faStar;

  /** Review Form */
  reviewForm: FormGroup;
  headline: string;
  comment: string;
  orderReference: string;
  rating: number = 0;
  customer: User;
  somethingWentWrong: boolean;
  order: string;
  cloudKitchenId: string;
  error: string;
  loading: boolean = false;
  destroy$ = new Subject<void>();
  errors: Errors = { errors: {} };
  errorMessage: any;
  orderNotSupplied: boolean;
  chefNotSupplied: boolean;
  customerNotLoggedIn: boolean;
  cloudKitchen: CloudKitchen;

  toasterService = inject(ToastService);
  success: boolean;

  constructor(
    private reviewService: ReviewService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private chefService: CloudKitchenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService.getData();
    this.accountService.loginSession$.subscribe({
      next: (value) => {
        this.customer = value;
        console.log('Customer subscribed ' + JSON.stringify(this.customer));
      },
      error: (err) => console.error('CustomerSubject emitted an error: ' + err),
      complete: () =>
        console.log('CustomerSubject emitted the complete notification'),
    });
    this.order = this.activatedRoute.snapshot.queryParamMap.get('order');
    this.cloudKitchenId = this.activatedRoute.snapshot.queryParamMap.get('cloudKitchen');
    if (Utils.isEmpty(this.order)) {
      this.orderNotSupplied = true;
      console.log('Oops. Order is not supplied.');
    }
    if (Utils.isEmpty(this.cloudKitchenId)) {
      this.chefNotSupplied = true;
      console.log('Oops. Chef not supplied');
    }
    if (Utils.isValid(this.customer)) {
      this.customerNotLoggedIn = true;
      console.log('Oops. Customer not logged in');
    }

    this.cloudKitchen = this.chefService.getData();
    this.chefService.cloudKitchenSubject$.subscribe({
      next: (value) => {
        this.cloudKitchen = value;
        console.log('ChefSubject emitted a notification: ' + this.cloudKitchen);
        if (
          (this.cloudKitchen == null || this.cloudKitchen === undefined) &&
          !Utils.isEmpty(this.cloudKitchenId)
        ) {
          this.loadCloudKitchen();
        }
      },
      error: (err) => console.error('ChefSubject emitted an error: ' + err),
      complete: () =>
        console.log('ChefSubject emitted the complete notification'),
    });
  }

  loadCloudKitchen() {
    let observable = this.chefService.retrieveKitchen(this.cloudKitchenId);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.cloudKitchen = data;
        console.log('Loaded chef frm server ');
      },
      error: (err) => {
        console.error(
          'Errors when getting chef from server. ' + JSON.stringify(err)
        );
      },
    });
  }

  setRating(arg0: number) {
    this.rating = arg0;
  }

  cancelReview() {}

  // convenience getter for easy access to form fields
  get reviewFormControls() {
    return this.reviewForm.controls;
  }

  onSubmitReview() {
    if (Utils.isEmpty(this.order)) {
      this.order = this.orderReference;
    }
    if (Utils.isEmpty(this.order)) {
      this.errorMessage = 'Order is mandatory';
      return;
    }
    if (Utils.isEmpty(this.headline)) {
      this.errorMessage = 'Headline is mandatory';
      return;
    }
    if (Utils.isEmpty(this.comment)) {
      this.errorMessage = 'Comment is mandatory';
      return;
    }

    this.errorMessage = null;

    this.loading = true;
    var review: Review = new Review();
    review.title = this.headline;
    review.comment = this.comment;
    review.rating = this.rating;
    review.order = this.order;
    review.date = new Date();
    review.cloudKitchenId = this.cloudKitchen._id;
    if (this.orderNotSupplied) {
      this.order = this.orderReference;
    }
    review.customer = {
      name: this.customer.name ,
      email: this.customer.email,
      mobile: this.customer.mobile,
      _id: this.customer._id,
      address: null,
    };

    let observable = this.reviewService.createReview(review);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.errorMessage = undefined;
        this.success = true;
      },
      error: (err) => {
        this.errors = err;
        this.loading = false;
        this.errorMessage = err.error.message;
        this.toasterService.error(this.errorMessage);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
