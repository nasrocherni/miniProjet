import { Chocolate } from "./chocolate";

export class OrderItem {
    constructor(
        public id:string,
        public chocolate:Chocolate,
        public quantity:number
       ){}
       
}
