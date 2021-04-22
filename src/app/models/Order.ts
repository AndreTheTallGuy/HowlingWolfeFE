import { Boat } from "./Boat";
import { Customer } from "./Customer";

export interface Order{
    order_id: string;
    customer: Customer;
    boats: Boat[];
}