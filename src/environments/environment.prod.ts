export const environment = {
  production: true,

  CURRENCY: 'GBP',
  CURRENCY_SYMBOL: '£',

  CollectionsUrl: "https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/collections",
  ChefsUrl: "https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/chefs",
  CuisinesUrl: "https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/cuisines",
  DishesUrl: "https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/dishes",
  ReviewsUrl: "https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/reviews",
  ServiceAreasUrl: "https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/serviceareas",
  MenusUrl: "https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/menus",
  CalendersUrl: "https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/calendars",
  GroupsUrl: 'https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/groups',
  ProductsUrl: 'https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/products',
  SupplierUrl: 'https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/suppliers',
  FeedbacksUrl: 'https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/feedbacks',
  PartyBundlesUrl: 'https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/party-bundles',
  PostcodeDistrictsUrl: 'https://chef-service-1b2023ebc956.herokuapp.com/ads/v1/postcode-districts',

  LoginUrl:
    'https://bigtree-auth-service-672f06320174.herokuapp.com/authenticate/customer/token',
  LogoutUrl:
    'https://bigtree-auth-service-672f06320174.herokuapp.com/api/auth/logout',
  RegisterUrl:
    'https://bigtree-auth-service-672f06320174.herokuapp.com/api/users/signup',
  PasswordResetInitiateUrl:
    'https://bigtree-auth-service-672f06320174.herokuapp.com/passwords/reset_initiate',
  PasswordResetSubmitUrl:
    'https://bigtree-auth-service-672f06320174.herokuapp.com/passwords/reset_submit',

  GetCustomerPreferencesUrl:
    'https://bigtree-auth-service-672f06320174.herokuapp.com/api/customers/replace-me/preferences',
  CreateOrUpdateCustomerPreferencesUrl:
    'https://bigtree-auth-service-672f06320174.herokuapp.com/api/customers/preferences',
  CreateContactsUrl:
    'https://bigtree-auth-service-672f06320174.herokuapp.com/api/contacts',
  UpdatePersonalDetails:
    'https://https://bigtree-auth-service-672f06320174.herokuapp.com/api/users/update_personal',


  // Orders
  FoodOrdersTrackingUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods-tracking',
  FoodOrdersUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods',
  FoodOrderSearchUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods/search',
  FoodOrdersStripePaymentsUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods/stripe-payments',
  FoodOrdersPaymentIntentUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/foods/stripe-payments/payment-intent',
  ProductOrdersUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/products',
  ProductOrdersSearchUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/products/search',
  ProductOrdersPaymentsUrl: 'https://order-service-9ff7ad1220e2.herokuapp.com/orders/v1/products/stripe-payments',


  debug: false,

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
