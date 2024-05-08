import { Component } from '@angular/core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Address } from 'src/app/model/common';

@Component({
  selector: 'app-post-ad',
  templateUrl: './post-ad.component.html',
  styleUrls: ['./post-ad.component.css']
})
export class PostAdComponent {

  submitted: boolean = false;
  loading: boolean = false;
  successful: boolean = false;
  category: string;
  title: string;
  description: string;
  propertyIntention: string;
  rentAmount: string;
  rentalPeriod: string;
  dateAvailable: Date;
  minDate: any;
  faCalendar = faCalendar;
  adAddress: Address;

  onChangeCategory(e: any) {
    this.category = e.target.value;
  }

  handlePropertyIntend(evt: any) {
    this.propertyIntention = evt.target.value;
  }

  handleRentalPeriod(evt: any) {
    this.rentalPeriod = evt.target.value;
  }
  onSelectAddress(address: Address) {
    this.adAddress = address;
  }
}
