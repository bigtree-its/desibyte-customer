import { CloudKitchenMini, Extra } from "./all-foods";
import { Customer, Review } from "./common";


export class KitchenOrderTracking {
    _id: string;
    orderId: string;
    reference: string;
    status: string;
    dateAccepted: Date;
    datePaid: Date;
    dateCancelled: Date;
    dateDelivered: Date;
    dateCollected: Date;
    dateRefunded: Date;
}

export class KitchenOrderProfileResponse {
    today: KitchenOrder[];
    sevenDays: KitchenOrder[];
    month: KitchenOrder[];
    lastMonth: KitchenOrder[];
    sixMonth: KitchenOrder[];
    year: KitchenOrder[];
    todayRevenue: number;
    sevenDaysRevenue: number;
    monthRevenue: number;
    lastMonthRevenue: number;
    sixMonthsRevenue: number;
    yearRevenue: number;
    dateRange: KitchenOrder[];
    dateFrom: Date;
    dateTo: Date;
}

export class KitchenOrder {
    _id: string;
    cloudKitchen: CloudKitchenMini;
    customer: Customer;
    reference: string;
    notes: string;
    currency: string;
    status: string;
    items: KitchenOrderItem[];
    subTotal: number;
    total: number;
    deliveryFee: number;
    packagingFee: number;
    serviceFee: number;
    dateCreated: Date;
    collectBy: Date;
    expectedDeliveryDate: Date;
    dateAccepted: Date;
    dateDelivered: Date;
    dateCollected: Date;
    serviceMode: string;
    collectionDate: Date;
    deliveryDate: Date;
    review: Review;
    customerNotes?: Note[];
    kitchenNotes?: Note[];
}

export class KitchenOrderItem {
    _tempId: number;
    productId: string;
    image: string;
    name: string;
    quantity: number;
    price: number;
    extras: Extra[];
    choice: Extra;
    subTotal: number;
    specialInstruction: string;
}

export class Note{
    message?: string;
    dateTime?: Date;
}