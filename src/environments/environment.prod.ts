// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,

  ImageKitFileDelete: 'https://api.imagekit.io/v1/files/',
  ImageKitUrlEndpoint: 'https://ik.imagekit.io/kikysfekf/',
  ImageKitPublicKey: 'public_lZUoTdhXv3WpkWzuim951yu10PM=',
  
  CURRENCY: 'GBP',
  CURRENCY_SYMBOL: '£',
  AD_REMOTE: 'https://ad-service-bd07dee8092c.herokuapp.com',
  ORDER_REMOTE: 'https://order-service-9ff7ad1220e2.herokuapp.com',
  AUTH_REMOTE: 'https://bigtree-auth-service-672f06320174.herokuapp.com',
  GEO_REMOTE: 'https://bigtree-geo-78f520f4abb3.herokuapp.com',

  AUTH_LOCAL: 'http://localhost:8081',
  ORDER_LOCAL: 'http://localhost:8082',
  AD_LOCAL: 'http://localhost:8083',
  GEO_LOCAL: 'http://localhost:8085',

  // Ads
  CollectionsUrl: "https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/collections",
  CuisinesUrl: "https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/cuisines",
  DishesUrl: "https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/dishes",
  ReviewsUrl: "https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/reviews",
  MenusUrl: "https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/menus",
  CalendersUrl: "https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/calendars",
  GroupsUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/groups',
  ProductsUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/products',
  SupplierUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/suppliers',
  CloudKitchenUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/cloud-kitchens',
  FeedbacksUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/feedbacks',
  PartyBundlesUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/party-bundles',

// Orders
  FoodOrdersTrackingUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods-tracking',
  FoodOrdersUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods',
  FoodOrderSearchUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods/search',
  FoodOrdersStripePaymentsUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods/stripe-payments',
  FoodOrdersPaymentIntentUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods/stripe-payments/payment-intent',
  ProductOrdersUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/products',
  ProductOrdersSearchUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/products/search',
  ProductOrdersPaymentsUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/products/stripe-payments',

  // Supplier Orders
  KitchenOrderProfileUrl: "https://order-service-9ff7ad1220e2.herokuapp.com/kitchen-orders/v1/profile",
  KitchenOrdersUrl: "https://order-service-9ff7ad1220e2.herokuapp.com/kitchen-orders/v1",
  
  // Auth
  LoginUrl:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/auth/token',
  LogoutUrl:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/auth/logout',
  RegisterUrl:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/users/signup',
  PasswordResetInitiateUrl:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/auth/passwords/reset_initiate',
  PasswordResetSubmitUrl:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/auth/passwords/reset_submit',
  AccountActivationUrl:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/auth/account_activate',
  GetCustomerPreferencesUrl:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/customers/replace-me/preferences',
  CreateOrUpdateCustomerPreferencesUrl:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/customers/preferences',
  CreateContactsUrl:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/contacts',
  UpdatePersonalDetails:'https://bigtree-auth-service-672f06320174.herokuapp.com/v1/users/update_personal',
 

  //Ads
  AdPropertyUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/properties',
  AdsUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/ads',
  UploadImagesUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/imagekit/upload_images',
  AdEnquiryUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/ad-enquiries',
  ImageKitTokenUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/imagekit/token',
  ImageKitFilesUrl: 'https://ad-service-bd07dee8092c.herokuapp.com/ads/v1/imagekit/files',


  //GEO
  PostcodeDistrictUrl: 'https://bigtree-geo-78f520f4abb3.herokuapp.com/uk-post/v1/postcode-districts',
  
  /** API Tier**/
  API_Tier_PRIVATE_KEY: 'NYdGEdtZDf7YaKcGhdtYm9D3uzIjau7Y6b1ISLns',
  API_Tier_Baseurl: 'https://postcode.apitier.com',
  API_Tier_Postcode: 'https://postcode.apitier.com/v1/postcodes/',

  /** RapidAPI  */
  X_RapidAPI_Url:
    'https://samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com/ByPostcode/json',
  X_RapidAPI_Host:
    'samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com',
  X_RapidAPI_Key:
    '249a5c6ab3mshce3cf38f2ca8130p195a93jsn3ad1c6002c20',
  CUSTOMER_APP_ACCESS_TOKEN:
    'eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDdXN0b21lckFwcCIsImxhc3ROYW1lIjoiQ3VzdG9tZXJBcHAiLCJjbGllbnRUeXBlIjoiQ3VzdG9tZXJBcHAiLCJtb2JpbGUiOiIwNzk3OTE5MTE3NiIsImN1c3RvbWVySWQiOiI2NThlY2YxYjUyOTAyNDI0OTc2MzYxMDUiLCJleHAiOjE3MzkwNDg0NDIsInN1YiI6IlRoZUN1c3RvbWVyQXBwQGdtYWlsLmNvbSJ9.k0sPPCwRHRjZjh20koEAOSY1UNdNaggQJaqc0TfcmdbhpNIiHOHmtcZxu2Jp3kDSMNCfmoKyQX51eTF71jWWfQ',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
