import { Boat } from "./Boat";
import { Customer } from "./Customer";

export interface Order{
    order_id: number;
    customer: Customer;
    boats: Boat[];
}