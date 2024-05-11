import { Component, EventEmitter, Output, inject } from '@angular/core';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Address, RapidApiByPostcodeResponse, RapidApiByPostcodeResponseSummary } from 'src/app/model/common';
import { RapidApiService } from 'src/app/services/common/rapid-api.service';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-postcode-lookup',
  templateUrl: './postcode-lookup.component.html',
  styleUrls: ['./postcode-lookup.component.css']
})
export class PostcodeLookupComponent {

  rapidApiService = inject(RapidApiService);
  showAddressList: boolean;
  faSearch = faSearch;
  faClose = faClose;

  selectedAddress: string;
  addressSelected: boolean;
  customerAddress: Address;
  addressLookupPostcode: string;
  postcodeAddressList: RapidApiByPostcodeResponseSummary[];
  rapidApiByPostcodeResponseSummary: RapidApiByPostcodeResponseSummary;

  @Output() addressEmitter = new EventEmitter<Address>;
  

  onEnter() {
    if (this.addressLookupPostcode &&this.addressLookupPostcode.length >= 5) {
      this.doFakeLookup();
    }
   
  }
  closeServiceLocations() {
    this.showAddressList = false;
    this.selectedAddress = undefined;
    this.addressLookupPostcode = undefined;
    this.postcodeAddressList = [];
  }

  findAddress() {
    if (this.addressLookupPostcode &&this.addressLookupPostcode.length >= 5) {
      this.doFakeLookup();
    }
  }

  onSubmitPostcodeLookup() {
    console.log('Search address form submitted..');
    if (this.addressLookupPostcode &&this.addressLookupPostcode.length >= 5) {
      this.doFakeLookup();
    }
  }

  doFakeLookup(){
    this.postcodeAddressList = [{
      Id: 0,
      StreetAddress: '359, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    },
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    },
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    },
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    },
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    },
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    },
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }
    ,
    {
      Id: 1,
      StreetAddress: '361, Glasgow Road, Eaglesham',
      Place: 'Glasgow'
    }

  ]
    this.addressSelected = false;
    this.showAddressList = true;
  }

  doPostcodeLookup() {
    this.rapidApiService
      .lookupAddresses(this.addressLookupPostcode.trim())
      // .pipe(first())
      .subscribe(
        (data: RapidApiByPostcodeResponse) => {
          this.postcodeAddressList = data.Summaries;
          this.addressSelected = false;
          this.showAddressList = true;
          console.log('Address Lookup response ' +JSON.stringify(this.postcodeAddressList));
        },
        (error) => {
          console.log( 'Address Lookup resulted an error.' + JSON.stringify(error));
        }
      );
  }

  onSelectDeliveryAddress(selectAddress: RapidApiByPostcodeResponseSummary) {
    
    // var city = selectAddress.Place.split(/[\s ]+/).pop();
    this.customerAddress = {
      city: selectAddress.Place,
      addressLine1: selectAddress.StreetAddress,
      addressLine2: selectAddress.Place,
      country: 'UK',
      postcode: this.addressLookupPostcode,
      latitude: '',
      longitude: '',
    };
    this.addressSelected = true;
    console.log('User clicked '+ JSON.stringify(this.customerAddress))
    this.addressEmitter.emit(this.customerAddress);
    this.selectedAddress = Utils.addressToShortString(this.customerAddress);
    this.showAddressList = false;
    this.postcodeAddressList = [];
  }
}
