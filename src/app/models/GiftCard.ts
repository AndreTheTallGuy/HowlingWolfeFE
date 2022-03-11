export interface GiftCard {
    cardNumber: number;
    balance: number;
    email: string;
    coupon?: string;
    orderedOn?: Date;
    
}