export interface Coupon {
    id?: number;
    code: string;
    discount: number;
    goodUntil: Date;
}