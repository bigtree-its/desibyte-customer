import { Address, AdOwner, Customer, NameValue, PostalLocation } from './common';

export class GeneralAd {
  category: string;
  title: string;
  status: string;
  image?: ImageKitImg;
  views?: number;
  reference?: string;
  description: string[];
  gallery?: ImageKitImg[];
  address?: Address;
  location?: PostalLocation;
  price: number;
  dateAvailable: Date;
  datePosted: Date;
  adOwner: AdOwner;
  featured?: boolean;
  approved?: boolean;
  active?: boolean;
}

export class ImageKitImg{
  fileId: string;
  name: string;
  size: string;
  filePath: string;
  url: string;
  fileType: string;
  height: string;
  width: string;
  thumbnailUrl: string;
}

export class PropertyAd {
  views?: number;
  title: string;
  tenure: string;
  consumptionType: string;
  status: string;
  image?: ImageKitImg;
  reference: string;
  size: string;
  summary?: string;
  description: string[];
  keyFeatures?: string[];
  gallery?: ImageKitImg[];
  type: string;
  address: Address;
  price: number;
  saleAmountOfferOver?: boolean;
  rentPeriod?: string;
  dateAvailable: Date;
  datePosted: Date;
  bedrooms: number;
  bathrooms: number;
  adOwner: AdOwner;
  featured?: boolean;
  schools?: School[];
  superStores?: SuperStore[];
  stations?: NameValue[];
  hospitals?: NameValue[];
  shops?: NameValue[];
  parks?: NameValue[];
  malls?: NameValue[];
  leisureCenters?: NameValue[];
  floorPlan?: String[];
  postcodeDistrict?: string;
}

export interface School {
  name: string;
  distance: string;
  address: Address;
  isPrimary: boolean;
  isSecondary: boolean;
  isStateSchool: boolean;
}

export interface SuperStore {
  name: string;
  distance: string;
  address: Address;
}

export class AdSearchQuery {
  category?: string;
  adOwner?: string;
  postcodeDistrict?: string;
  postcode?: string;
  city?: string;
  coverage?: string;
  reference?: string;
  minAmount?: number;
  maxAmount?: number;
  lastWeek?: boolean;
  lastMonth?: boolean;
}
export class PropertySearchQuery {
  adOwner?: string;
  location?: string;
  postcode?: string;
  type?: string;
  area?: string;
  reference?: string;
  minAmount?: number;
  maxAmount?: number;
  minBedroom?: number;
  maxBedroom?: number;
  consumptionType?: string;
  lastWeek?: boolean;
  lastMonth?: boolean;
}

export class AdEnquiry {
  _id?: string;
  adOwner?: AdOwner;
  reference?: string;
  category?: string;
  message?: string;
  customer?: Customer;
  date?: Date;
  responses?: [AdEnquiryResponse]
}
export class AdEnquiryResponse {
  message?: string;
  date?: Date;
}

export class ImagekitAuthReq{

}