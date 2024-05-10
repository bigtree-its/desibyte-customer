import { Address, Customer, NameValue } from "./common";

export interface PropertyAd {
    title: string;
    tenure: string;
    consumptionType: string;
    status: string;
    image: string;
    reference: string;
    size: string;
    summary: string;
    description: string[];
    keyFeatures: string[];
    gallery: string[];
    type: string;
    address: Address;
    price: number;
    saleAmountOfferOver: boolean;
    rentPeriod: string;
    dateAvailable: Date;
    datePosted: Date;
    bedrooms: number;
    bathrooms: number;
    adOwner: Customer;
    featured: boolean;
    schools: School[],
    superStores: SuperStore[],
    stations: NameValue[],
    hospitals: NameValue[],
    shops: NameValue[],
    parks: NameValue[],
    malls: NameValue[],
    leisureCenters: NameValue[],
    floorPlan: String[],
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

  export class AdSearchQuery{
    adOwner?: string;
    location?: string;
    category?: string;
    reference?: string;
    min?: number;
    max?: number;
    fromDate?: Date;
    toDate?: Date;
    lastWeek?: boolean;
    lastMonth?: boolean;
  }