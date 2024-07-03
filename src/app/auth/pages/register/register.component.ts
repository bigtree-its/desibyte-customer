import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from 'src/app/model/all-auth';
import { AccountService } from 'src/app/services/auth/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  register: RegisterRequest;
  registerForm: FormGroup;
  errorMessage: any;
  signupSuccess: boolean;
  loading: boolean;

  constructor(private accountService: AccountService,
    private router: Router,
    ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ])
    });
  }

  registerUser() {
    this.errorMessage= null;
    this.signupSuccess = false;
    if (this.registerForm.valid) {
      this.register = {
        firstName: this.registerForm.get('firstName').value,
        lastName: this.registerForm.get('lastName').value,
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
        mobile: this.registerForm.get('mobile').value,
        userType: 'Customer',
      };
      console.log('Registering '+ JSON.stringify(this.register))
      this.loading = true;
      this.accountService.register(this.register).subscribe(
        (data) => {
          console.warn(JSON.stringify(data, null, 2));
          this.signupSuccess = true;
          this.loading = false;
        },
        (err) => {
          this.signupSuccess = false;
          this.loading = false;
          this.errorMessage = err.error?.detail;
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }

  signIn() {
    this.router.navigate(['/login']);
  }
}
