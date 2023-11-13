import { Document, Types } from "mongoose";

export interface OrderItem {
    menuItemId?: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
    total: number;
}

interface OrderStatus {
    status: string;
    timestamp?: Date;
}

export interface OrderTypes extends Document {
    user_id: Types.ObjectId;   /*Customer's Account Id where from which order is placed!*/
    restaurent_id: Types.ObjectId;
    items: OrderItem[];
    orderStatus: OrderStatus[]; /*  Preparing / Ready / PickedUp / Delivered / Cancel  */
    orderTotal: {
        subTotal: number;
        taxesAndFees: number;
        discount?: number;
        deliveryFee: number;
        grandTotal: number;
    },
    orderNotes?: string;
    feedbackAndRating?: {
        rating?: number;
        feedbackText?: string;
    },
    timestamp: {
        orderPlacement: Date;
        acceptedByRestaurent?: Date;
        pickedUpByDriver?: Date;
        delivered?: Date;
    },
    paymentInformation: {
        paymentMethod: string;
        transactionId?: string;
    }
}
