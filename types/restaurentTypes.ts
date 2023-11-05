import { Document, Types } from "mongoose";

// Restaurent Schema Types
type Address = {
    address: string;
    city: string;
    state: string;
    postal_code: number;
    country: string;
    landmark?: string
}

export interface RestaurentModelType extends Document {
    user_id: Types.ObjectId;
    address: Address;
    restaurent_name: string;
    description: string;
    opening_time: string;
    closing_time: string;
    createdAt: Date;
    restaurent_type: string;
    cuisine: string[];
    // menu: Types.ObjectId;
}