import { Document } from "mongoose";

// User Schema Types
interface Address {
    address: string;
    street: string;
    city: string;
    state: string;
    postal_code: number;
    country: string;
}

export interface UserType extends Document {
    name?: string;
    email: string;
    password: string;
    address?: Address[];
    role: string;
}