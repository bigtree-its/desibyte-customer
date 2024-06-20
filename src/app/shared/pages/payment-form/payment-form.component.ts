import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FoodOrder } from 'src/app/model/all-foods';
import { PaymentIntentRequest, PaymentIntentResponse } from 'src/app/model/common';
import { StripeService } from 'src/app/services/common/stripe.service';
import { ToastService } from 'src/app/services/common/toast.service';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css'],
})
export class PaymentFormComponent {
  @ViewChild('linkAuthenticationInfo', { read: ElementRef })
  public linkAuthenticationInfo: ElementRef<any>;
  @ViewChild('payment-element', { read: ElementRef })
  public paymentElement: ElementRef<any>;
  @ViewChild('cardErrors', { read: ElementRef })
  public cardErrors: ElementRef<any>;
  @ViewChild('payment-message', { read: ElementRef })
  public paymentMessage: ElementRef<any>;

  enablePayButton: boolean = false;
  @Input() order: FoodOrder;
  @Input() paymentIntentId: string;
  @Input() clientSecret: string;
  stripeConfirmationError: string;
  stripeElements: any;
  cardElement: any;
  loading: boolean = false;

  constructor(
    private stripeService: StripeService,
    private orderService: FoodOrderService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
   this.loading = false;
  }

  ngAfterViewInit(): void {
    this.loading = false;
    if (this.stripeService.stripe === undefined) {
      this.stripeService.getStripe().subscribe((s) => {
        console.log('Initializing Stripe card element inside form: ' + this.stripeService.stripe);
        this.initializeStripe();
      });
    } else {
      this.initializeStripe();
    }
  }

  initializeStripe() {
    const appearance = {
      theme: 'stripe',
    };
    
    var secret = this.clientSecret;
    console.log('Initializing stripe elements with clientSecret: ' + secret);
    this.stripeElements = this.stripeService.stripe.elements({clientSecret: secret});
    const paymentElementOptions = {layout: 'tabs',};

    const paymentElement = this.stripeElements.create('payment', paymentElementOptions);
    paymentElement.mount('#payment-info');
    paymentElement.addEventListener('change', (result: any) => {
      this.enablePayButton = result.complete ? true : false;
      this.cardErrors = result.error && result.error.message;
    });



    // var linkAuthentication = this.stripeElements.create("linkAuthentication");
    // linkAuthentication.mount(this.linkAuthenticationInfo.nativeElement);

    // this.linkAuthenticationElement.on('change', (event) => {
    //   const emailAddress: string = event.value.email;
    // });
    // linkAuthentication.addEventListener("change", (result: any) => {
    // this.enablePayButton = (result.complete) ? true : false;
    // this.cardErrors = result.error && result.error.message;
    // const emailAddress: string = result.email;
    // console.log('The customer email: ' + emailAddress)
    // });


    // const paymentElement = this.stripeElements.create("payment", paymentElementOptions);
    // paymentElement.mount(this.paymentElement.nativeElement);

    // this.createCardElement();
  }

  private createCardElement() {
    const style = {
      base: {
        color: '#303238',
        fontSize: '16px',
        border: '1px solid var(--v-border)',
        fontFamily: '"Open Sans", sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#CFD7DF',
        },
      },
      invalid: {
        color: '#e5424d',
        ':focus': {
          color: '#303238',
        },
      },
    };

    this.cardElement = this.stripeElements.create('card', style);
    // this.cardElement.mount(this.cardInfo.nativeElement);
    this.cardElement.addEventListener('change', (result: any) => {
      this.enablePayButton = result.complete ? true : false;
      this.cardErrors = result.error && result.error.message;
    });
  }

  ngOnDestroy() {
    if (this.cardElement) {
      this.cardElement.removeEventListener('change', (result: any) => {
        this.cardErrors = result.error && result.error.message;
        this.cardElement.destroy();
      });
    }
  }

  handleStripConfirmation(response) {
    if (response !== null && response !== undefined) {
      if (response.error) {
        this.stripeConfirmationError = response.error.message;
      } else {
        this.confirmPurchase();
      }
    }
  }

  confirmPurchase() {
    console.log('Confirming order..');
    this.orderService.placeOrder(this.order);
  }

  makePayment() {
    console.log('Confirming Payment');
    var paymentIntentRequest = new PaymentIntentRequest();
    paymentIntentRequest.currency = 'GBP';
    paymentIntentRequest.amount = this.order.total;
    paymentIntentRequest.orderReference = this.order.reference;
    this.orderService
      .createPaymentIntent(paymentIntentRequest)
      .subscribe((result: PaymentIntentResponse) => {
        var paymentIntentResponse = result;
        var customerEmail = '';
        if (
          paymentIntentResponse !== null &&
          paymentIntentResponse !== undefined &&
          paymentIntentResponse.clientSecret !== null &&
          paymentIntentResponse.clientSecret !== undefined
        ) {
          // var stripeElements = (<any>window).getStripeElements();
          // (<any>window).pay(stripeElements.stripe, stripeElements.card, this.paymentIntentResponse.clientSecret, this);
        } else {
          console.log('Unable to collect payment from your card.');
        }
      });
  }

  // Stripe returns to this url:
  //http://localhost:5200/order-confirmation/7a022f19-d82f-4b8a-9525-86a768af35b0?
  //payment_intent=pi_3Nkt1IJtRMxkXWc31hypLmHB&
  //payment_intent_client_secret=pi_3Nkt1IJtRMxkXWc31hypLmHB_secret_zD9W7MrKPXyS2awWy2vUQVnvp&
  //redirect_status=succeeded

  async confirmPaymentIntent() {
    // this.orderService.getData();
    this.loading = true;
    console.log('Confirming payment intent');
    const elements = this.stripeElements;
    const clientSecret = this.clientSecret;
    // const {paymentIntent, error} = await this.stripeService.stripe.confirmCardPayment({
    //   elements,
    //   confirmParams: {
    //     // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
    //     return_url: 'http://localhost:4200/order-confirmation',
    //     receipt_email: "nava.arul@gmail.com",
    //   },
    // });
    // if (error) {
    //   if ( error.payment_intent.status === 'succeeded'){
    //     var er = 'Something is not right. Looks this order has already been paid. Please contact customer support';
    //     this.toastService.error(er);
    //   }else{
    //     this.toastService.error('Something went wrong, Please contact customer support.');
    //   }
    // } else if (paymentIntent && paymentIntent.status === 'succeeded') {
    //   this.toastService.info('You payment is successful')
    // }

    const { error } = await this.stripeService.stripe.confirmPayment(
      {
        elements,
        confirmParams: {
          // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
          return_url: 'http://desify.co.uk/foods/confirmation',
          receipt_email: 'nava.arul@gmail.com',
        },
      }
    );
    if (error) {
      console.log(JSON.stringify(error))
      this.loading = false;
      // this.orderService.updateSinglePaymentIntent(error.payment_intent.id, error.payment_intent.status);
    }


    // this.stripeService.stripe
    //   .confirmPayment({
    //     elements,
    //     confirmParams: {
    //       // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
    //       return_url: 'http://localhost:4200/order-confirmation',
    //       receipt_email: 'nava.arul@gmail.com',
    //     },
    //   })
    //   .then(function (result) {
    //     if (result.error) {
    //       if (result.error.payment_intent?.status === 'succeeded') {
    //        console.log('Something is not right. Looks this order has already been paid. Please contact customer support');
    //       } else {
    //         console.log(
    //           'Something went wrong, Please contact customer support.'
    //         );
    //       }
    //     }
    //   });
  }

  updatePaymentIntent(id: string, status: string) {
    this.orderService.updateSinglePaymentIntent(id, status);
  }

  async confirmPayment() {
    // e.preventDefault();
    // setLoading(true);
    const elements = this.stripeElements;
    const { error } = await this.stripeService.stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: 'http://localhost:4200/order-confirmation',
        receipt_email: 'nava.arul@gmail.com',
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    this.cardErrors = error && error.message;
    // if (error.type === "card_error" || error.type === "validation_error") {
    //   this.cardErrors = error && error.message;
    // } else {
    //   this.cardErrors = "An unexpected error occurred.";
    //   showMessage("An unexpected error occurred.");
    // }

    // setLoading(false);
  }

  // Fetches the payment intent status after payment submission
  async checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    const { paymentIntent } =
      await this.stripeService.stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
      case 'succeeded':
        console.log('Payment succeeded!');
        break;
      case 'processing':
        console.log('Your payment is processing.');
        break;
      case 'requires_payment_method':
        console.log('Your payment was not successful, please try again.');
        break;
      default:
        console.log('Something went wrong.');
        break;
    }
  }
}
