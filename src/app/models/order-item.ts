import { Chocolate } from "./chocolate";

export class OrderItem {
    constructor(
        // public chocolate:Chocolate | string,
        public chocolate: any,
        public quantity: number,
        public totalPrice: number
    ) { }

}
