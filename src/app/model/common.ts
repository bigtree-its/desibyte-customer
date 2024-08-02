export interface Contacts {
  _id?: string;
  fullName: string;
  email: string;
  mobile: string;
  about: string;
  message: string;
}

export class Supplier {
  _id: string;
  name: string;
  tradingName: string;
  image: string;
  email: string;
  mobile: string;
  telephone?: string;
  address: Address;
}

export class Customer {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  telephone?: string;
  address: Address;
}

export class AdOwner {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  telephone?: string;
  address: Address;
}

export class Address {
  propertyNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country?: string;
  latitude?: string;
  longitude?: string;
}

export class PostalLocation{
  postcode?: string;
  city?: string;
  country?: string;
  // Clarkston
  coverage?: string;
  // Postcode District Prefix. i.e G76, G77 etc
  postcodeDistrict?: string;
}

export class Contact {
  person?: string;
  email?: string;
  mobile?: string;
  telephone?: string;
}

export interface ApiResponse {
  endpoint: string;
  message: string;
}

export interface ServiceLocation {
  _id: string;
  name: string;
  city: string;
  slug: string;
  country: string;
}

export class Review {
  cloudKitchenId: string;
  order: string;
  title: string;
  comment: string;
  date: Date;
  rating: number;
  customer: Customer;
}

export class PostcodeDistrict {
  public _id: string;
  public active: boolean;
  public prefix: string;
  public city: string;
  public coverage: string;
  public slug: string;
}

export class PostcodeDistrictQuery {
  public prefix?: string;
  public city?: string;
  public coverage?: string;
  public popular?: boolean;
}


export class PostcodeLookupResult {
  public postcode: string;
  public latitude: string;
  public longitude: string;
  public addresses: PostcodeLookupResultAddress[];
}

export class PostcodeLookupResultAddress {
  public formatted_address: string[];
  public thoroughfare: string;
  public building_name: string;
  public sub_building_name: string;
  public sub_building_number: string;
  public building_number: number;
  public line_1: string;
  public line_2: string;
  public line_3: string;
  public line_4: string;
  public locality: string;
  public town_or_city: string;
  public county: string;
  public district: string;
  public country: string;
}

export class RapidApiByPostcodeResponse {
  Summaries: RapidApiByPostcodeResponseSummary[];
}

export class RapidApiByPostcodeResponseSummary {
  Id: number;
  StreetAddress: string;
  Place: string;
}
export class Distance {
  public from: Place;
  public to: Place;
  public metres: string;
}

export class Place {
  public postcode: string;
  public latitude: string;
  public longitude: string;
}

export class RapidApiResult {
  public Summaries: RapidApiAddress[];
}

export class RapidApiAddress {
  public Id: number;
  public StreetAddress: string;
  public Place: string;
}

export class PaymentIntentRequest {
  currency: string;
  amount: number;
  orderReference: string;
  customerEmail: string;
}

export class PaymentIntentResponse {
  id: string;
  intentId: string;
  object: string;
  amount: string;
  orderReference: string;
  clientSecret: string;
  currency: string;
  status: string;
  error: Boolean;
  liveMode: Boolean;
  errorMessage: string;
  paymentMethod: string;
  chargesUrl: string;
  supplier: string;
  metaData: Map<string, string>;
}

export interface NameValue {
  name: string;
  value: string;
}


