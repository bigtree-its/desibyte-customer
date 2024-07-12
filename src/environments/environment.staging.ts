// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  staging:true,

  CURRENCY: 'GBP',
  CURRENCY_SYMBOL: '£',

  CollectionsUrl: "http://chef-service-1b2023ebc956.herokuapp.com/ads/v1/collections",
  ChefsUrl: "http://chef-service-1b2023ebc956.herokuapp.com/ads/v1/chefs",
  CuisinesUrl: "http://chef-service-1b2023ebc956.herokuapp.com/ads/v1/cuisines",
  DishesUrl: "http://chef-service-1b2023ebc956.herokuapp.com/ads/v1/dishes",
  ServiceAreasUrl: "http://chef-service-1b2023ebc956.herokuapp.com/ads/v1/serviceareas",
  MenusUrl: "http://chef-service-1b2023ebc956.herokuapp.com/ads/v1/menus",
  CalendersUrl: "http://chef-service-1b2023ebc956.herokuapp.com/ads/v1/calendars",
  OrderTrackingUrl: "https://polar-fortress-28097-08459456d8d7.herokuapp.com/api/order-tracking",
  FoodOrdersUrl: "https://polar-fortress-28097-08459456d8d7.herokuapp.com/api/customer-orders",
  FoodOrderSearchUrl: "https://polar-fortress-28097-08459456d8d7.herokuapp.com/api/customer-orders/search",
  StripePaymentsUrl: "https://polar-fortress-28097-08459456d8d7.herokuapp.com/api/stripe-payments",
  PaymentIntentUrl: "https://polar-fortress-28097-08459456d8d7.herokuapp.com/api/stripe-payments/payment-intent",

 
  debug: window['env']['debug'] || false,

  /** RapidAPI  */
  X_RapidAPI_Url:
    window['env']['X_RapidAPI_Url'] ||
    'https://samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com/ByPostcode/json',
  X_RapidAPI_Host:
    window['env']['X_RapidAPI_Host'] ||
    'samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com',
  X_RapidAPI_Key:
    window['env']['X_RapidAPI_Key'] ||
    '249a5c6ab3mshce3cf38f2ca8130p195a93jsn3ad1c6002c20',
  CUSTOMER_APP_ACCESS_TOKEN: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2MtY2FwcC0zMTUyNjQiLCJpc3MiOiJ3d3cuYXV0aC5ob2MuY29tIiwiaWF0IjoxNzAzODc3MDI0LCJleHAiOjE3MzUzNDQwMDB9.Mdw14EyUbfIZkWh5Td5EuJRg_avzI6NM6D9tStM_64g3pm49fAl2Jt9DgZgtfCH4vt1VVxwkudikybCD5Eap2w"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
