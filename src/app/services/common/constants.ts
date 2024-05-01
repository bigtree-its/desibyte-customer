import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  static StorageItem_F_Order: string = 'f_order';
  static StorageItem_P_Order: string = 'p_order';
  static StorageItem_C_User: string = 'c_user';
  static StorageItem_C_Chef: string = 'c_chef';
  static StorageItem_C_Reviews: string = 'c_reviews';
  static StorageItem_C_Preferences: string = 'c_preferences';
  static StorageItem_Location: string = 'location';
  static StorageItem_P_OrderList: string = 'p_order_list';
  static StorageItem_F_OrderList: string = 'f_order_list';
;
}
