import { Schema, model } from "mongoose";
import { MenuTypes } from "../types/menuTypes";

const MenuSchema = new Schema<MenuTypes>({
    restaurant_id: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurent',
        required: [true, 'Restaurent Id is required!']
    },
    menu_items: [{
        name: {
            type: String,
            required: [true, 'Dish name is required!']
        },
        description: {
            type: String,
        },
        cuisine_type: {
            type: String,
            required: [true, 'cuisine is required!'],
        },
        meal_type: {
            type: String,
        },
        price: {
            type: Number,
            required: [true, 'Price is required!']
        },
        category: {
            type: String,
            required: [true, 'Category of food is required'],
            default: 'other'
        },
        isVegetarian: {
            type: Boolean,
            required: [true, 'Veg Or Non-veg is required!'],
            default: false,
        },
        dishImage: {
            public_url: {
                type: String,
                // required: true
            },
            url: {
                type: String,
                // required: true,
            },
        }
    }],
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
});

export const Menu = model<MenuTypes>('Menu', MenuSchema);