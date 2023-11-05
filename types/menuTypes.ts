import { Document, Types } from "mongoose";

type MenuItem = {
    name: string,
    description?: string,
    cuisine_type: string,   /*Indian,Italian,Chinese,Thai,etc*/
    meal_type: string,     /*Dinner,Breakfast,Lunch,Snack,etc*/
    price: number;
    category: string;
    isVegetarian: boolean;
}

export interface MenuTypes extends Document {
    restaurant_id: Types.ObjectId;
    menu_items: MenuItem[];
    createdAt: Date;
}