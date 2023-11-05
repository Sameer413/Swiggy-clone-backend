import { Document, Types } from "mongoose";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
    total: number;
}

interface OrderStatus {
    status: string;
    timestamp: Date;
}

export interface OrderTypes extends Document {
    user_id: Types.ObjectId;
    restaurent_id: Types.ObjectId;
    items: OrderItem[];
    orderStatus: OrderStatus[];
    orderTotal: {
        subTotal: number;
        taxesAndFees: number;
        discount: number;
        deliveryFee: number;
        grandTotal: number;
    },
    orderNotes?: string;
    feedbackAndRating: {
        rating: number;
        feedbackText?: string;
    },
    timestamp: {
        orderPlacement: Date;
        acceptedByRestaurent?: Date;
        pickedUpByDriver?: Date;
        delivered: Date;
    },
    paymentInformation: {
        paymentMethod: string;
        transactionId: string;
    }
}