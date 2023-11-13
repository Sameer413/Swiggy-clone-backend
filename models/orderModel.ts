import { Schema, model } from "mongoose";
import { OrderTypes } from "../types/orderTypes";

const orderSchema = new Schema<OrderTypes>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'User Id is required!'],
        ref: 'User'
    },
    restaurent_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Restaurent Id is required!'],
        ref: 'Restaurent'
    },
    items: [{
        name: {
            type: String,
            required: [true, 'item name is required!']
        },
        quantity: {
            type: Number,
            required: [true, 'item quantity is required!']
        },
        price: {
            type: Number,
            required: [true, 'price is required!']
        },
        specialInstructions: {
            type: String,
        },
        total: {
            type: Number,
            required: [true, 'total price is required!']
        },
    }],
    orderNotes: {
        type: String,
    },
    feedbackAndRating: {
        rating: {
            type: Number,
        },
        feedbackText: {
            type: String,
        }
    },
    timestamp: {
        orderPlacement: {
            type: Date,
            default: () => new Date()
        },
        acceptedByRestaurent: {
            type: Date,
        },
        pickedUpByDriver: {
            type: Date,
        },
        delivered: {
            type: Date,
        },
    },
    orderStatus: [{
        status: {
            type: String,
            required: [true, 'Order status is required!'],
            default: 'pending'
        },
        timestamp: {
            type: Date,
            default: () => Date.now()
        }
    }],
    orderTotal: {
        subTotal: {
            type: Number,
            required: [true, 'SubTotal is required!'],
            default: 0,
        },
        taxesAndFees: {
            type: Number,
            required: [true, 'SubTotal is required!'],
            default: 0,
        },
        discount: {
            type: Number,
            required: [true, 'SubTotal is required!'],
            default: 0,
        },
        deliveryFee: {
            type: Number,
            required: [true, 'SubTotal is required!'],
            default: 0,
        },
        grandTotal: {
            type: Number,
            required: [true, 'SubTotal is required!'],
            default: 0,
        },
    },
    paymentInformation: {
        paymentMethod: {
            type: String,
            required: [true, 'Payement Method is required!'],
            default: 'Cash'
        },
        transactionId: {
            type: String,
            default: null
        }
    }
});

export const Order = model<OrderTypes>('Order', orderSchema);