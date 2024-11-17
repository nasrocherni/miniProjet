import { User } from "./user";

export class Review {
    constructor(
        public id:string,
        public user:User,
        public comment:string,
        public rating:number 
       ){}
       
}
