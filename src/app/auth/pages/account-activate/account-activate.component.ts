import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountActivationRequest, Errors } from 'src/app/model/all-auth';
import { AccountService } from 'src/app/services/auth/account.service';
import { CryptoService } from 'src/app/services/common/crypto.service';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-account-activate',
  templateUrl: './account-activate.component.html',
  styleUrls: ['./account-activate.component.css']
})
export class AccountActivateComponent implements OnInit, OnDestroy {

  accountId: string = '';
  activationCode: string = '';
  error: string;
  destroy$ = new Subject<void>();
  errors: Errors = { errors: {} };
  loading: boolean;
  success: boolean;
  errorMessage: any;

  constructor(private accountSvc: AccountService,
    private activatedRoute: ActivatedRoute,
    private cryptoService: CryptoService,
    private router: Router) { }

  ngOnInit(): void {
    const qs = this.activatedRoute.snapshot.queryParamMap.get('qs');
    if ( Utils.isEmpty(qs)){
      this.errorMessage = "Something went wrong. Retry again."
    }else{
      var decryptedQS = this.cryptoService.decrypt(qs);
      console.log('Decrypted qs '+ decryptedQS)
      var params = decryptedQS.split("&");
      this.accountId = params[0].split("=")[1];
      this.activationCode = params[1].split("=")[1];
      if ( Utils.isEmpty(this.activationCode) ||  Utils.isEmpty(this.accountId)){
        this.errorMessage = "Something went wrong. Retry again."
      }else{
        this.loading = true;
        this.submit();
      }
    }
  }

  submit() {

    this.errorMessage = undefined;
    if (Utils.isEmpty(this.accountId)) {
      this.error = 'AccountId is mandatory';
      return;
    }
    if (Utils.isEmpty(this.activationCode)) {
      this.error = 'Activation code is mandatory';
      return;
    }
    var req: AccountActivationRequest = {
      activationCode: this.activationCode,
      accountId: this.accountId
    }
    console.log('Activating account: '+ JSON.stringify(req))
    let observable = this.accountSvc.activateAccount(req)
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        console.log('account activation has been submitted')
        void this.router.navigate(["/login"])
      },
      error: (err) => {
        console.error('Errors from account activation.'+ JSON.stringify(err))
        this.errors = err;
        this.errorMessage = err.error.detail;
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
}
