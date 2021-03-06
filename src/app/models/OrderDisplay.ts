export interface OrderDisplay {
    id: string;
    boatId: string;
    date: Date;
    shuttle: string;
    time: string;
    duration: string;
    boat: string;
    name: string;
    height: string;
    weight: string;
    email: string;
    phone: string;
    coupon: string;
    price: number;
    discount?: number;
    giftCard?: number;
    gcDebit?: number; 
    type?: string;
    comment?: string;
    orderedOn: Date;
}