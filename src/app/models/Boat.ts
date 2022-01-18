export interface Boat{
    id: string;
    boat: string;
    shuttle: string;
    height: string;
    weight: string;
    date: Date;
    time: string;
    duration: string;
    price: number;
    discount?: number;
    giftCard?: number;
    gcDebit?: number; 
}