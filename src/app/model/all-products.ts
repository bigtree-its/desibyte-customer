import { NameValue } from "./common";

export interface Group {
    _id: string;
    name: string;
    image: string;
    slug: string;
    active: Boolean;
  }
  
 
  export interface ProductInfo{
    title: string,
    details: string[],
    moreInfo: NameValue[]
  }
  
  export interface SupplierBasic{
    _id: string,
    name: string,
    canClubDelivery: boolean,
    tradingName: string,
    email: string,
    mobile: string,
    telephone: string,
    freeDeliveryOver: number,
    deliveryFee: number,
    packingFee: number,
  
  }
  
  
  export interface Product {
    _id: string;
    name: string;
    productInfo: ProductInfo[];
    image: string;
    shortDesc: string;
    slug: string;
    group: string;
    supplier: SupplierBasic;
    size: Variant;
    sizes: Variant[];
    color: Variant;
    colors: Variant[];
    variants: Variant[];
    material: string;
    careInstruction: string;
    storageInstruction: string;
    shippingAndReturns: string;
    deliveryLeadTime: number;
    gallery: string[];
    price: number;
    priceOld: number;
    dateAdded: Date;
    details: string[];
    featured: Boolean;
    preOrder: Boolean;
    discontinued: Boolean;
    collectionOnly: Boolean;
    active: Boolean;
  }
  
  export interface OrderQuery {
    reference?: string;
    customerEmail?: string;
    supplierId?: string;
    orderId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    all?: boolean;
  }
  
  export interface Order {
    id: string;
    customer: Customer;
    reference: string;
    status?: string;
    currency: string;
    serviceMode: string;
    items: OrderItem[];
    subTotal: number;
    total: number;
    deliveryFee: number;
    packingFee: number;
    serviceFee: number;
    dateCreated: Date;
    collectBy: Date;
    dateDeleted: Date;
    expectedDeliveryDate: Date;
    dateAccepted: Date;
    dateDelivered: Date;
    dateCollected: Date;
    notes: string;
  }
  
  export interface OrderItem {
    deliveryNotes: string;
    promotionApplied: number;
    _tempId: number;
    image: string;
    productId: string;
    supplier: SupplierBasic;
    productName: string;
    quantity: number;
    deliveryLeadTime: number;
    price: number;
    size: Variant;
    color: Variant;
    subTotal: number;
    clubDelivery: boolean;
  }
  
  export interface SaleOrder{
    reference: string;
    datePlaced: Date;
    customer: Customer;
    saleOrderPerSuppliers: SaleOrderPerSupplier[];
    subTotal: number;
    total: number;
    grandTotal: number;
    promotionsApplied: number;
    serviceFee: number;
    deliveryFee: number;
  }
  
  export interface SaleOrderItem {
    _tempId: number;
    image: string;
    productId: string;
    productName: string;
    quantity: number;
    deliveryLeadTime: number;
    price: number;
    size: Variant;
    color: Variant;
    subTotal: number;
    deliveryFee: number;
    promotionsApplied: number;
    dateDispatched: Date;
    dateDelivered: Date;
    dateReturned: Date;
    dateRefunded: Date;
    deliveryNotes: string;
    clubDelivery: boolean;
  }
  
  export interface SaleOrderPerSupplier{
    supplier: SupplierBasic;
    subTotal: number;
    total: number;
    grandTotal: number;
    promotionsApplied: number;
    deliveryFee: number;
    items: SaleOrderItem[];
    datePlaced: Date;
    dateDispatched: Date;
    dateDelivered: Date;
    dateReturned: Date;
    dateRefunded: Date;
  }
  
  export interface Feedback {
    _id: string;
    product: string;
    rating: number;
    title: string;
    comment: string;
    customer: Customer;
    order: string;
    date: Date;
  }
  export interface Customer {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    telephone?: string;
    address: Address;
  }
  
  export interface Contact {
    person: string;
    email: string;
    mobile: string;
    telephone: string;
  }
  
  export interface Supplier {
    _id: string;
    name: string;
    tradingName: string;
    description: string[];
    image: string;
    slug: string;
    email: string;
    address: Address;
    deliveryFee: number;
    freeDeliveryOver: number;
    packagingFee: number;
    deliveryMinimum: number;
    deliveryDistance: number;
    minimumOrder: number;
    rating: number;
    reviews: number;
    doDelivery: Boolean;
    preOrderOnly: Boolean;
    paymentRequireApproval: Boolean;
    active: Boolean;
    contact: Contact;
  }
  
  export interface CheckoutItem{
    freeDelivery: Boolean;
    clubShipment: Boolean;
    freeDeliveryShortfall: number;
    items: OrderItem[],
  }
  
  export interface Address {
      addressLine1: string;
      city: string;
      postcode: string;
      country: string;
      latitude: string;
      longitude: string;
      addressLine2: string;
  }
  
  export interface Variant {
    name: string;
    price: number;
    detail: string;
  }
  
  