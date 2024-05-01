import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js/pure';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  stripeKey: string = 'pk_test_51Nk2lYJtRMxkXWc3ieSrfd0Q2KvP6oKt5hBmPbgYwgn0hVzLilvaaVhL12N35iuP6c5qqrmZaub84BYXtvHCLako0093RQFGWO';
  public stripe: any;
  constructor() {
    from(
      loadStripe(this.stripeKey).then(
      res => {
        this.stripe = res;
        console.log('Load stripe response: '+ this.stripe.elements)
      }
    )
      .catch(error => {
        console.log('Error while loading stripe, : ', error);
      }));
   }

  LoadStripe(): Observable<boolean> {
    return from(
      loadStripe(this.stripeKey).then(
      res => {
        this.stripe = res;
        console.log('Load stripe response: '+ this.stripe.elements)
        return true;
      }
    )
      .catch(error => {
        console.log('Error while loading stripe, : ', error);
        return false;
      }));
  }

  getStripe():Observable<any>{
    return from(
      loadStripe(this.stripeKey).then(
        res => {
          this.stripe = res;
          console.log('Load stripe response: '+ this.stripe.elements)
          return res;
        }
    )
    .catch(error => {
      console.log('Error while loading stripe, : ', error);
      return false;
    }));
  }

  LoadStripe2(): Observable<any> {
    return from(loadStripe(this.stripeKey).then(
      res => {
        console.log('Load stripe response: '+ res)
        this.stripe = res;
        return res;
      }
    )
      .catch(error => {
        console.log('Error while loading stripe, : ', error);
        return false;
      }));
  }
}
