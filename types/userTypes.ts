import { Document, Types } from "mongoose";

// User Schema Types
interface Address {
    _id?: Types.ObjectId;
    address: string;
    street?: string;
    city: string;
    state: string;
    postal_code: number;
    country: string;
}

export interface UserType extends Document {
    name?: string;
    mobile?: number;
    email: string;
    password: string;
    address?: Address[];
    role: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
}