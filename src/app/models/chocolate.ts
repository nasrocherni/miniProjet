import { Category } from "./category";
import { Review } from "./review";

export class Chocolate {
    constructor(
        public id:string,
        public name:string, 
        public type:string,
        public description:string,
        public price:number,
        public imageUrl:string,
        public availability:boolean,
        public reviews:Review[],
        public category:Category){}
       
}
