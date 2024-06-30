import { Address, Contact, Customer } from "./common";

export interface CloudKitchenMini{
    _id?: string;
    name?: string;
    image?: string;
    mobile?: string;
    email?: string;
    address?: Address;
}


export class OrderStatus{
    static readonly created?: string = "Draft";
    static readonly accepted?: string = "Accepted";
    static readonly paid?: string = "Paid";
    static readonly processing?: string = "Processing";
    static readonly collected?: string = "Collected";
    static readonly delivered?: string = "Delivered";
    static readonly cancelled?: string = "Cancelled";
    static readonly refunded?: string = "Refunded";
}

export class CloudKitchen{
    _id?: string;
    name?: string;
    image?: string;
    description?: string[];
    keywords?: string[];
    partyDescription?: string[];
    allergenAdvice?: string[];
    collectionTimings?: string[];
    cuisines?: Cuisine[];
    dishes?: Dish[];
    serviceAreas?: string[];
    rating?: number;
    reviews?: number;
    partyOrderLeadDays?: number;
    address?: Address;
    contact?: Contact;
    active?: boolean;
    packagingFee?: number;
    doPartyOrders?: boolean;
    doDelivery?: boolean;
    freeDeliveryOver?: number;
    deliveryFee?: number;
    minimumOrder?: number;
    minimumPartyOrder?: number;
    open?: boolean;
    preOrderOnly?: boolean;
}

export interface Cuisine {
    _id?: string;
    name?: string;
    logo?: string;
    slug?: string;
}

export interface Dish {
    _id?: string;
    name?: string;
    slug?: string;
    logo?: string;
}

export class Collection {
    _id?: string;
    name?: string;
    cloudKitchenId?: string;
    slug?: String;
    image?: String;
}

export class Extra {
    _id?: string;
    name?: string;
    price?: number;
    quantity?: number;
}

export class Menu {
    _id?: string;
    cloudKitchenId?: string;
    collectionId?: string;
    image?: string;
    preOrder?: boolean;
    vegetarian?: boolean;
    special?: boolean;
    discounted?: boolean;
    collectionOnly?: boolean;
    spice?: number;
    extras?: Extra[];
    choices?: Extra[];
    description?: string;
    name?: string;
    price?: number;
    discountedPrice?: number;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    orderBy?: Date;
    readyBy?: Date;
    
}

export interface Calendar {
    _id?: string;
    cloudKitchenId?: string;
    description?: string[];
    date?: Date;
    foods?: Menu[];
}

export interface CloudKitchenSearchQuery {
    dishes?: string;
    cuisines?: string;
    email?: string;
    keywords?: string;
    serviceAreas?: string;
    minimumOrder?: boolean;
    collectionOnly?: boolean;
    doDelivery?: boolean;
    doPartyOrders?: boolean;
    open?: boolean;
}

export interface CloudKitchenOrder{
    id?: string;
    cloudKitchenId?: string;
    customerEmail?: string;
    customerMobile?: string;
    reference?: string;
    currency?: string;
    serviceMode?: string;
    paymentReference?: string;
    status?: string;
    items?: FoodOrderItem[];
    subTotal?: number;
    total?: number;
    deliveryFee?: number;
    packagingFee?: number;
    saleTax?: number;
    dateCreated?: Date;
    dateUpdated?: Date;
    dateDeleted?: Date;
    orderCreated?: Date;
    orderAccepted?: Date;
    orderCollected?: Date;
    orderDelivered?: Date;
    orderRejected?: Date;
    delivery?: boolean;
    pickup?: boolean;
    pickupTime?: Date;
    deliveryTime?: Date;
    customer?: Customer;
    cloudKitchen?: CloudKitchen;
    review?: Review;
    notes?: string;
}

export interface FoodOrder {
    id?: string;
    paymentIntentId?: string;
    clientSecret?: string;
    cloudKitchen?: CloudKitchenMini;
    customer?: Customer;
    reference?: string;
    status?: string;
    currency?: string;
    serviceMode?: string;
    items?: FoodOrderItem[];
    partyItems?: PartyOrderItem[];
    subTotal?: number;
    total?: number;
    deliveryFee?: number;
    packingFee?: number;
    serviceFee?: number;
    dateCreated?: Date;
    partyDate?: Date;
    deliverBy?: Date;
    collectBy?: Date;
    dateDeleted?: Date;
    expectedDeliveryDate?: Date;
    dateAccepted?: Date;
    dateDelivered?: Date;
    dateCollected?: Date;
    partyOrder?: Boolean;
    notes?: string;
}


export interface CloudKitchenSummary{
    totalOrdersWeekly?: number;
    totalOrdersMonthly?: number;
    totalOrdersYearly?: number;
    
    totalRevenueWeekly?: number;
    totalRevenueMonthly?: number;
    totalRevenueYearly?: number;
   
    ordersWeekly?: FoodOrder[];
    ordersMonthly?: FoodOrder[];
    ordersYearly?: FoodOrder[];

    weeklyGrouping?: Map<Date, number>;
    monthlyGrouping?: Map<Date, number>;
    yearlyGrouping?: Map<string, number>;
}

export interface OrderSearchQuery {
    reference?: string;
    customerEmail?: string;
    cloudKitchenId?: string;
    thisMonth?: boolean;
    thisYear?: boolean;
    all?: boolean;
    orderId?: string;
}

export interface OrderTracking{
    reference?: string;
    status?: string;
}

export interface OrderUpdateRequest {
    reference?: string;
    id?: string;
    paymentIntentId?: string;
    paymentStatus?: string;
    status?: string;
    chefNotes?: string;
    customerComments?: string;
    expectedCollectionDate?: Date;
    expectedDeliveryDate?: Date;
    customerRating?: number;
}

export interface CustomerReview {
    customerEmail?: string;
    cloudKitchenId?: string;
    comments?: string;
    reviewDate?: Date;
    rating?: number;
    customerName?: string;
    customerMobile?: string;
}

export interface Review {
    comments?: string;
    rating?: number;
}

export interface CloudKitchenOrders{
    orders?: CloudKitchenOrder[]
}

export interface FoodOrderItem {
    _tempId?: number;
    id?: string;
    image?: string;
    name?: string;
    quantity?: number;
    price?: number;
    extras?: Extra[];
    choice?: Extra;
    subTotal?: number;
    specialInstruction?: string;
}

export interface PartyOrderItem {
    _tempId?: number;
    id?: string;
    image?: string;
    name?: string;
    quantity?: number;
    price?: number;
    candidates?: PartyBundleCandidate[];
    extras?: Extra[];
    subTotal?: number;
    specialInstruction?: string;
}

const PartyBundleCandidate = {
    name: String,
    required: Boolean,
    max: Number,
    items: [{
        type: String,
        ref: 'Menu'
    }]
}

export interface PartyBundleCandidate {
    name?: string;
    required?: boolean;
    max?: number;
    items?: Menu[]
}

export interface PartyBundle{
    image?: string;
    _id?: string;
    cloudKitchenId?: string;
    collectionId?: string;
    name?: string;
    slug?: string;
    price?: number;
    partyBundleCandidates?: PartyBundleCandidate[],
    extras?: Extra[],
    vegetarian?: boolean,
    discounted?: boolean,
    discountedPrice?: number,
    description?: string,
    active?: boolean,
}