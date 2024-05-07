import { Injectable } from '@angular/core';
import { LocalChef } from 'src/app/model/all-foods';

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


  static getChefAddress(chef: LocalChef) {
    var address: string = '';

    if (chef === null || chef === undefined) {
      return address;
    }
    if (chef.address.addressLine1 !== undefined) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + chef.address.addressLine1;
    }
    if (chef.address.addressLine2 !== undefined) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + chef.address.addressLine2;
    }
    if (chef.address.city !== undefined) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + chef.address.city;
    }
    if (chef.address.postcode !== undefined) {
      if (address.length > 0) {
        address = address + ', ';
      }
      address = address + chef.address.postcode;
    }
    return address;
  }
}
