import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Errors } from 'src/app/model/all-auth';
import { AccountService } from 'src/app/services/auth/account.service';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  loading: boolean = false;
  successful: boolean = false;
  password: string = '';
  error: string;
  email: string;
  returnUrl: string;
  destroy$ = new Subject<void>();
  errors: Errors = { errors: {} };
  errorMessage: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.submitted = false;
    this.successful = false;
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if ( this.returnUrl !== null && this.returnUrl !== undefined){
      this.accountService.redirectUrl = this.returnUrl;
    }
  }

  submit() {
    // stop here if form is invalid
    if (Utils.isEmpty(this.email)) {
      this.error = 'Email is mandatory';
      return;
    }
    if (Utils.isEmpty(this.password)) {
      this.error = 'Password is mandatory';
      return;
    }
    this.submitted = true;
    // reset alerts on submit
    this.loading = true;
    console.log('Submitting login..')
    let observable = this.accountService.customerLogin(this.email, this.password);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.errorMessage = undefined;
      },
      error: (err) => {
        console.error('Errors from reset submit.'+ JSON.stringify(err))
        this.errors = err;
        this.loading = false;
        this.errorMessage = err.error.detail;
      },
    });

  }

  forgotPassword() {
   
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  joinUs() {
    this.router.navigate(['/register']);
  }
}
