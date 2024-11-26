import { User } from "./user";

export class Review {
    constructor(
        public id: string,
        public message: string,
        // public user: User | string,
        public user: any,
        public comment: string,
        public rating: number
    ) { }

}
