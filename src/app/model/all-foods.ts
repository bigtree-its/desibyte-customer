import { Address, Contact, Customer } from "./common";

export interface OrderSupplier{
    _id: string;
    name: string;
    tradingName: string;
    image: string;
    mobile: string;
    email: string;
    address: Address;
}

export class OrderStatus{
    static readonly created: string = "DRAFT";
    static readonly accepted: string = "ACCEPTED";
    static readonly paid: string = "PAID";
    static readonly processing: string = "PROCESSING";
    static readonly collected: string = "COLLECTED";
    static readonly delivered: string = "DELIVERED";
    static readonly cancelled: string = "CANCELLED";
    static readonly refunded: string = "REFUNDED";
}

export interface LocalChef {
    _id: string | undefined;
    coverPhoto: string | undefined;
    name: string;
    email: string;
    image: string;
    kitchenName: string;
    days: string[];
    description: string[];
    cuisines: Cuisine[];
    dishes: Dish[];
    slots: Slot[];
    serviceAreas: LocalArea[];
    categories: string[];
    specials: string[];
    gallery: string[];
    rating: number;
    reviews: number;
    partyOrderLeadDays: number;
    address: Address;
    contact: Contact;
    active: boolean;
    minimumOrder: number;
    packagingFee: number;
    doPartyOrders: boolean;
    doDelivery: boolean;
    partyOrders: boolean;
    freeDeliveryOver: number;
    deliveryMinimum: number;
    deliveryFee: number;
    deliveryDistance: number;
    minimumPartyOrder: number;
    open: boolean;
    preOrderOnly: boolean;
    paymentRequireApproval: boolean;
}

export interface Slot {
    _id: string;
    name: string;
    logo: string;
    slug: string;
}

export interface Cuisine {
    _id: string;
    name: string;
    logo: string;
    slug: string;
}

export interface Dish {
    _id: string;
    name: string;
    slug: string;
    logo: string;
}

export class Collection {
    _id: string;
    name: string;
    chefId: string;
    slug: String;
    image: String;
}

export interface LocalAreaSearchResponse {
    localAreas: LocalArea[];
}

export interface LocalArea {
    _id: string;
    name: string;
    city: string;
    slug: string;
    country: string;
}

export interface Extra {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Food {
    _id: string;
    _uid: number;
    chefId: string;
    category: string;
    image: string;
    vegetarian: boolean;
    spice: number;
    extras: Extra[];
    choices: Extra[];
    description: string;
    name: string;
    price: number;
    discounted: boolean;
    discountedPrice: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    
}

export class Menu {
    _id: string;
    chefId: string;
    collectionId: string;
    image: string;
    preOrder: boolean;
    vegetarian: boolean;
    special: boolean;
    discounted: boolean;
    collectionOnly: boolean;
    spice: number;
    extras: Extra[];
    choices: Extra[];
    description: string;
    name: string;
    price: number;
    discountedPrice: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    orderBy: Date;
    readyBy: Date;
    
}

export interface Calendar {
    _id: string;
    chefId: string;
    description: string[];
    date: Date;
    foods: Menu[];
}

export interface LocalChefSearchQuery {
    dishes: string;
    serviceAreaSlug: string;
    cuisines: string;
    slots: string;
    email: string;
    postcodeDistricts: string;
    status: string;
    noMinimumOrder: boolean;
    collectionOnly: boolean;
    delivery: boolean;
    takingOrdersNow: boolean;
}

export interface SupplierOrder{
    id: string;
    chefId: string;
    customerEmail: string;
    customerMobile: string;
    reference: string;
    currency: string;
    serviceMode: string;
    paymentReference: string;
    status: string;
    items: FoodOrderItem[];
    subTotal: number;
    total: number;
    deliveryFee: number;
    packagingFee: number;
    saleTax: number;
    dateCreated: Date;
    dateUpdated: Date;
    dateDeleted: Date;
    orderCreated: Date;
    orderAccepted: Date;
    orderCollected: Date;
    orderDelivered: Date;
    orderRejected: Date;
    delivery: boolean;
    pickup: boolean;
    pickupTime: Date;
    deliveryTime: Date;
    customer: Customer;
    chef: Chef;
    review: Review;
    notes: string;
}

export interface FoodOrder {
    id: string;
    paymentIntentId: string;
    clientSecret: string;
    supplier: OrderSupplier;
    customer: Customer;
    reference: string;
    status?: string;
    currency: string;
    serviceMode: string;
    items: FoodOrderItem[];
    partyItems: PartyOrderItem[];
    subTotal: number;
    total: number;
    deliveryFee: number;
    packingFee: number;
    serviceFee: number;
    dateCreated: Date;
    partyDate: Date;
    deliverBy: Date;
    collectBy: Date;
    dateDeleted: Date;
    expectedDeliveryDate: Date;
    dateAccepted: Date;
    dateDelivered: Date;
    dateCollected: Date;
    partyOrder: Boolean;
    notes: string;
}


export interface SupplierSummary{
    totalOrdersWeekly: number;
    totalOrdersMonthly: number;
    totalOrdersYearly: number;
    
    totalRevenueWeekly: number;
    totalRevenueMonthly: number;
    totalRevenueYearly: number;
   
    ordersWeekly: FoodOrder[];
    ordersMonthly: FoodOrder[];
    ordersYearly: FoodOrder[];

    weeklyGrouping: Map<Date, number>;
    monthlyGrouping: Map<Date, number>;
    yearlyGrouping: Map<string, number>;
}

export interface OrderSearchQuery {
    reference?: string;
    customerEmail?: string;
    chefId?: string;
    thisMonth?: boolean;
    thisYear?: boolean;
    all?: boolean;
    orderId?: string;
}

export interface OrderTracking{
    reference: string;
    status: string;
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
    customerEmail: string;
    chefId: string;
    comments: string;
    reviewDate: Date;
    rating: number;
    customerName: string;
    customerMobile: string;
}

export interface Review {
    comments: string;
    rating: number;
}

export interface FoodOrderList {
    orders: FoodOrder[]
}

export interface Orders {
    orders: FoodOrder[]
}

export interface SupplierOrders{
    orders: SupplierOrder[]
}

export interface Chef {
    _id: string;
    coverPhoto: string;
    name: string;
    email: string;
    displayName: string;
    days: string[];
    description: string[];
    cuisines: Cuisine[];
    slots: string[];
    serviceAreas: LocalArea[];
    categories: string[];
    specials: string[];
    gallery: string[];
    rating: number;
    reviews: number;
    address: Address;
    contact: Contact;
    active: boolean;
    minimumOrder: number;
    packagingFee: number;
    delivery: boolean;
    partyOrders: boolean;
    freeDeliveryOver: number;
    deliveryMinimum: number;
    deliveryFee: number;
    deliveryDistance: number;
    minimumPartyOrder: number;
}


export interface FoodOrderItem {
    _tempId: number;
    id: string;
    image: string;
    name: string;
    quantity: number;
    price: number;
    extras: Extra[];
    choice: Extra;
    subTotal: number;
    specialInstruction: string;
}

export interface PartyOrderItem {
    _tempId: number;
    id: string;
    image: string;
    name: string;
    quantity: number;
    price: number;
    candidates: PartyBundleCandidate[];
    extras: Extra[];
    subTotal: number;
    specialInstruction: string;
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
    name: string;
    required: boolean;
    max: number;
    items: Food[]
}

export interface PartyBundle{
    image: string;
    _id: string;
    chefId: string;
    collectionId: string;
    name: string;
    slug: string;
    price: number;
    partyBundleCandidates: PartyBundleCandidate[],
    extras: Extra[],
    vegetarian: boolean,
    discounted: boolean,
    discountedPrice: number,
    description: string,
    active: boolean,
}