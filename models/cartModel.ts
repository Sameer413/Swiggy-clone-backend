import { Document, Schema, Types, model } from "mongoose";

interface CartType extends Document {
    menu_id: Types.ObjectId;
    user_id: Types.ObjectId;
    restaurent_id: Types.ObjectId;
    quantity: number;
}

const cartModel = new Schema<CartType>({
    menu_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Menu id required!'],
        ref: 'Menu'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Menu id required!'],

    },
    restaurent_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Menu id required!'],
    },
    quantity: {
        type: Number,
        default: 1,
    }
});

export const Cart = model<CartType>('Cart', cartModel);