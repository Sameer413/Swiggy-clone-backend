import { Schema, model } from "mongoose";
import { RestaurentModelType } from "../types/restaurentTypes";


const restaurentSchema = new Schema<RestaurentModelType>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Restaurent Owner is required!'],
        ref: 'User'
    },
    restaurent_name: {
        type: String,
        required: [true, 'Restaurent Name is required!']
    },
    description: {
        type: String,
        required: [true, 'Description about the restaurent is required!']
    },
    opening_time: {
        type: String,
        required: [true, 'Opening time is required!']
    },
    closing_time: {
        type: String,
        required: [true, 'Closing time is required!']
    },
    address: {
        address: {
            type: String,
            required: [true, 'Address is required!']
        },
        country: {
            type: String,
            required: [true, 'Country is required!']
        },
        city: {
            type: String,
            required: [true, 'City is required!']
        },
        postal_code: {
            type: Number,
            required: [true, 'postal Code is required!']
        },
        state: {
            type: String,
            required: [true, 'State is required!']
        },
        landmark: {
            type: String,
        }
    },
    restaurent_type: {
        type: String,
        required: [true, 'Restaurent type required for veg/non-veg!']
    },
    cuisine: {
        type: [String],
        required: [true, 'Cuisine is required!']
    },
    // menu: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Menu'
    // },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
})

export const Restaurent = model<RestaurentModelType>('Restaurent', restaurentSchema);