import { Document, Types, } from "mongoose";

interface MenuItem {
    _id?: Types.ObjectId;   /*Need to add this because of the access issue of _id in array*/
    name: String,
    description?: string,
    cuisine_type?: string,   /*Indian,Italian,Chinese,Thai,etc*/
    meal_type: string,     /*Dinner,Breakfast,Lunch,Snack,etc*/
    price: number;
    category: string;
    isVegetarian: boolean;
    dishImage?: {
        public_url: string;
        url: string;
    }
}

export interface MenuTypes extends Document {
    restaurant_id: Types.ObjectId;
    menu_items: MenuItem[];
    createdAt: Date;
}