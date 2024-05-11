import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LocalChef } from 'src/app/model/all-foods';
import { Address } from 'src/app/model/common';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  
  
  constructor() { }

  static days: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  static daysShort: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  static monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  static monthNamesShort: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  static compare(v1: string | number, v2: string | number) {
    return (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);
  }

  static isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  public static isCollectionEmpty(data: any[]): Boolean {
    if (data === null || data === undefined || data.length === 0) {
      return true;
    }
    return false;
  }

  public static isEmpty(data: string): Boolean {
    if (data === null || data === undefined || data.length === 0) {
      return true;
    }
    return false;
  }

  public static isValid(data: any): Boolean {
    if (data === null || data === undefined) {
      return false;
    }
    return true;
  }

  static getJsDate(dateAvailable: NgbDateStruct) {
    return new Date(dateAvailable.year, dateAvailable.month - 1, dateAvailable.day);
  }

  static getDateString(date: Date): string {
    return date.getFullYear+"-"+date.getMonth+"-"+date.getDay;
  }

  

  public static isEquals(data1: string, data2: string): Boolean {
    console.log('Comparing ' + data1 + " and " + data2)
    return data1 === data2;
  }

  static isStringValid(str: string): boolean {
    if (str === null || str === undefined || str.length === 0) {
      return false;
    }
    return true;
  }

  static addressToString(customerAddress: Address): string {
    var address: string = '';
    if (!customerAddress) {
      return address;
    }
    if (customerAddress.addressLine1) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + customerAddress.addressLine1;
    }
    if (customerAddress.addressLine2) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + customerAddress.addressLine2;
    }
    if (customerAddress.city) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + customerAddress.city;
    }
    if (customerAddress.postcode) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + customerAddress.postcode;
    }
    return address;
  }

  static addressToShortString(customerAddress: Address): string {
    var address: string = '';
    if (!customerAddress) {
      return address;
    }
    if (customerAddress.city) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + customerAddress.city;
    }
    if (customerAddress.postcode) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + customerAddress.postcode.toUpperCase();
    }
    return address;
  }

  static getChefAddress(chef: LocalChef) {
    var address: string = '';

    if (!chef) {
      return address;
    }
    return this.addressToString(chef.address);
   
  }
}
