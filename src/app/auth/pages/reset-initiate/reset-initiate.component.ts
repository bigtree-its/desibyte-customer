import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/services/auth/account.service';
import { CryptoService } from 'src/app/services/common/crypto.service';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-reset-initiate',
  templateUrl: './reset-initiate.component.html',
  styleUrls: ['./reset-initiate.component.css']
})
export class ResetInitiateComponent implements OnInit, OnDestroy{

  loading: boolean;
  email: string;
  destroy$ = new Subject<void>();
  errorMessage: string = null;
  onSubmission: boolean= false;

  constructor(
    private accountSvc: AccountService){}

  ngOnInit(): void {
      
  }

  submit(){
    this.onSubmission = false;
    if (Utils.isEmpty(this.email)) {
      this.errorMessage = 'Email is mandatory';
      return;
    }
    var req = {
      email: this.email,
      action: "ResetInitiate"
    }
    this.onSubmission = true;
    this.loading = true;
    this.errorMessage = null;

    let observable = this.accountSvc.passwordResetInitiate(req)
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        console.log('Reset password request has been initiated.')
        // void this.router.navigate(["/password_reset/submit"])
        this.onSubmission = true;
        this.loading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Errors from reset initiate.')
        this.onSubmission = false;
        this.loading = false;
        this.errorMessage = err.error.detail;
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
