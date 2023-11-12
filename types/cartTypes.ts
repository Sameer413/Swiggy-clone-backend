import { Document, Types } from "mongoose";

export interface CartType extends Document {
    user_id: Types.ObjectId;
    restaurent_id: Types.ObjectId;
    items: [{
        _id?: Types.ObjectId;
        menuItemId: Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
        specialInstructions?: string;
        total: number;
    }]
}