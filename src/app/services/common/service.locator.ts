import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceLocator {
  groupsUrl: string;
  productsUrl: string;
  feedbacksUrl: string;
  collectionsUrl: string;
  chefsUrl: string;
  cuisinesUrl: string;
  DishesUrl: string;
  menusUrl: string;
  ServiceAreasUrl: string;
  calendersUrl: string;

  FoodOrdersTrackingUrl: string;
  FoodOrdersUrl: string;
  FoodOrdersPaymentIntentUrl: string;
  FoodOrdersStripePaymentsUrl: string;
  FoodOrderSearchUrl: string;

  ProductOrdersUrl: string;
  ProductOrdersPaymentsUrl: string;
  
  LoginUrl: string;
  LogoutUrl: string;
  RegisterUrl: string;
  PasswordResetInitiateUrl: string;
  PasswordResetSubmitUrl: string;
  ReviewsUrl: string;
  GetCustomerPreferencesUrl: string;
  CreateOrUpdateCustomerPreferencesUrl: string;
  CreateContactsUrl: string;
  UpdatePersonalDetails: string;


  SupplierUrl: string;
  PartyBundlesUrl: string;
  PostcodeDistrictsUrl: string;
  
  //Ads
  AdPropertyUrl: string;
  AdsUrl: string;

  constructor() {
    this.SupplierUrl = environment.SupplierUrl;
    this.groupsUrl = environment.GroupsUrl;
    this.productsUrl = environment.ProductsUrl;
    this.feedbacksUrl = environment.FeedbacksUrl;
    this.collectionsUrl = environment.CollectionsUrl;
    this.chefsUrl = environment.ChefsUrl;
    this.cuisinesUrl = environment.CuisinesUrl;
    this.DishesUrl = environment.DishesUrl;
    this.ServiceAreasUrl = environment.ServiceAreasUrl;
    this.menusUrl = environment.MenusUrl;
    this.calendersUrl = environment.CalendersUrl;
    this.PartyBundlesUrl = environment.PartyBundlesUrl;
    this.PostcodeDistrictsUrl = environment.PostcodeDistrictsUrl;

    this.FoodOrdersTrackingUrl = environment.FoodOrdersTrackingUrl;
    this.FoodOrdersUrl = environment.FoodOrdersUrl;
    this.FoodOrderSearchUrl = environment.FoodOrderSearchUrl;
    this.FoodOrdersPaymentIntentUrl = environment.FoodOrdersPaymentIntentUrl;
    this.FoodOrdersStripePaymentsUrl = environment.FoodOrdersStripePaymentsUrl;
    this.ProductOrdersUrl = environment.ProductOrdersUrl;
    this.ProductOrdersPaymentsUrl = environment.ProductOrdersPaymentsUrl;

    this.LoginUrl = environment.LoginUrl;
    this.LogoutUrl = environment.LogoutUrl;
    this.RegisterUrl = environment.RegisterUrl;
    this.PasswordResetInitiateUrl = environment.PasswordResetInitiateUrl;
    this.PasswordResetSubmitUrl = environment.PasswordResetSubmitUrl;
    this.ReviewsUrl = environment.ReviewsUrl;
    this.GetCustomerPreferencesUrl = environment.GetCustomerPreferencesUrl;
    this.CreateOrUpdateCustomerPreferencesUrl = environment.CreateOrUpdateCustomerPreferencesUrl;
    this.CreateContactsUrl = environment.CreateContactsUrl;
    this.UpdatePersonalDetails = environment.UpdatePersonalDetails;


    this.AdPropertyUrl = environment.AdPropertyUrl;
    this.AdsUrl = environment.AdsUrl;
    
  }
}
