import { OrderItem } from "./order-item";
import { User } from "./user";

export class Order {
    constructor(
        public id: string,
        public user: User | string,
        public items: OrderItem[],
        public totalAmount: number,
        public status: string,
        public date: Date) { }
}
