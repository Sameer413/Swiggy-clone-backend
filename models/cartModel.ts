import { Schema, model } from "mongoose";
import { CartType } from "../types/cartTypes";

const cartModel = new Schema<CartType>({

    user_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Menu id required!'],

    },
    restaurent_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Menu id required!'],
    },
    items: [
        {
            menuItemId: {
                type: Schema.Types.ObjectId,
            },
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            specialInstructions: {
                type: String,
            },
            total: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

export const Cart = model<CartType>('Cart', cartModel);