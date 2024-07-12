import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { AdEnquiry, GeneralAd, PropertyAd } from 'src/app/model/all-ads';
import { User } from 'src/app/model/all-auth';
import { AdOwner, Customer } from 'src/app/model/common';
import { AdsService } from 'src/app/services/ads/ads.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit, OnDestroy{
  
  modalService = inject(NgbModal);
  adService = inject(AdsService);

  destroy$ = new Subject<void>();
  message: string;
  adReference: string;
  adCategory: string;
  adOwner: AdOwner;
  customer: Customer;
  faClose = faClose;

  @Input() user: User;
  @Input() ad: GeneralAd;
  @Input() property: PropertyAd;

  enquirySubmitted: boolean;

  ngOnInit(): void {
    if ( this.ad){
      this.adOwner = this.ad.adOwner;
      this.adReference = this.ad.reference;
      this.adCategory = this.ad.category;
    }
    if ( this.property){
      this.adOwner = this.property.adOwner;
      this.adReference = this.property.reference;
      this.adCategory = "Property";
    }
    if ( this.adOwner){
      this.message = "Hi "+this.adOwner.name+', I am interested in this. Is this still available?. Thanks ';
    }
    if ( this.user){
      var customer: Customer = {
        _id: this.user._id,
        name: this.user.firstName + " "+ this.user.lastName,
        email: this.user.email,
        mobile: this.user.mobile,
        address: null
      }
      this.customer= customer;
    }
  }

  contactOwner(){
    var adEnquiry: AdEnquiry = {
      adOwner: this.adOwner,
      reference: this.adReference,
      category: this.adCategory,
      message: this.message,
      customer: this.customer,
      date: new Date
    };
    let observable = this.adService.sendEnquiry(adEnquiry);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        console.log('Enquiry has been sent');
        this.enquirySubmitted = true;
      },
      error: (err) => {
        console.error('Errors during posting enquiry. ' + JSON.stringify(err));
      },
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'custom-class',
      })
      .result.then(
        (result) => { },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  close() {
    this.modalService.dismissAll();
  }
}
