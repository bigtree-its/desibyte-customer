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

  AUTH_LOCAL: 'http://localhost:8081',
  ORDER_LOCAL: 'http://localhost:8082',
  AD_LOCAL: 'http://localhost:8083',
  UK_POST_LOCAL: 'http://localhost:8085',

  // Ads
  CollectionsUrl: "http://localhost:8083/ads/v1/collections",
  CuisinesUrl: "http://localhost:8083/ads/v1/cuisines",
  DishesUrl: "http://localhost:8083/ads/v1/dishes",
  ReviewsUrl: "http://localhost:8083/ads/v1/reviews",
  MenusUrl: "http://localhost:8083/ads/v1/menus",
  CalendersUrl: "http://localhost:8083/ads/v1/calendars",
  GroupsUrl: 'http://localhost:8083/ads/v1/groups',
  ProductsUrl: 'http://localhost:8083/ads/v1/products',
  SupplierUrl: 'http://localhost:8083/ads/v1/suppliers',
  CloudKitchenUrl: 'http://localhost:8083/ads/v1/cloud-kitchens',
  FeedbacksUrl: 'http://localhost:8083/ads/v1/feedbacks',
  PartyBundlesUrl: 'http://localhost:8083/ads/v1/party-bundles',

// Orders
  FoodOrdersTrackingUrl: 'http://localhost:8082/orders/v1/foods-tracking',
  FoodOrdersUrl: 'http://localhost:8082/orders/v1/foods',
  FoodOrderSearchUrl: 'http://localhost:8082/orders/v1/foods/search',
  FoodOrdersStripePaymentsUrl: 'http://localhost:8082/orders/v1/foods/stripe-payments',
  FoodOrdersPaymentIntentUrl: 'http://localhost:8082/orders/v1/foods/stripe-payments/payment-intent',
  ProductOrdersUrl: 'http://localhost:8082/orders/v1/products',
  ProductOrdersSearchUrl: 'http://localhost:8082/orders/v1/products/search',
  ProductOrdersPaymentsUrl: 'http://localhost:8082/orders/v1/products/stripe-payments',

  // Supplier Orders
  KitchenOrderProfileUrl: "http://localhost:8082/orders/v1/profiles",
  KitchenOrderSearchUrl: "http://localhost:8082/orders/v1/foods/profiles",

  // Auth
  LoginUrl:'http://localhost:8081/v1/auth/token',
  LogoutUrl:'http://localhost:8081/v1/auth/logout',
  RegisterUrl:'http://localhost:8081/v1/users/signup',
  PasswordResetInitiateUrl:'http://localhost:8081/v1/auth/passwords/reset_initiate',
  PasswordResetSubmitUrl:'http://localhost:8081/v1/auth/passwords/reset_submit',
  AccountActivationUrl:'http://localhost:8081/v1/auth/account_activate',
  GetCustomerPreferencesUrl:'http://localhost:8081/v1/customers/replace-me/preferences',
  CreateOrUpdateCustomerPreferencesUrl:'http://localhost:8081/v1/customers/preferences',
  CreateContactsUrl:'http://localhost:8081/v1/contacts',
  UpdatePersonalDetails:'http://localhost:8081/v1/users/update_personal',
 

  //Ads
  AdPropertyUrl: 'http://localhost:8083/ads/v1/properties',
  AdsUrl: 'http://localhost:8083/ads/v1/ads',
  UploadImagesUrl: 'http://localhost:8083/ads/v1/imagekit/upload_images',
  AdEnquiryUrl: 'http://localhost:8083/ads/v1/ad-enquiries',
  ImageKitTokenUrl: 'http://localhost:8083/ads/v1/imagekit/token',
  ImageKitFilesUrl: 'http://localhost:8083/ads/v1/imagekit/files',


  //UK Post
  PostcodeDistrictUrl: 'http://localhost:8085/uk-post/v1/postcode-districts',
  
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
