export interface Coupon {
    id?: number;
    code: string;
    discountType: string;
    discount: number;
    goodUntil: Date;
    whenGood: Date[];
    goodForGC: boolean;
}