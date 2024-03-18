import { ObjectId } from "mongodb";

export interface ICustomer {
  id: ObjectId | string;
  first_name: string;
  last_name: string;
  gender: Gender;
  email: string;
  phone: string;
  city: string;
  company: string;
}

export enum Gender {
  "Male",
  "Female",
}
