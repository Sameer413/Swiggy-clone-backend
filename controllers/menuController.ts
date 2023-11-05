import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { MenuTypes } from "../types/menuTypes";
import { Menu } from "../models/menuModel";

export const getAllMenuByRestaurentId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

});

export const addMenuItem = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        description,
        category,
        cuisine_type,
        isVegetarian,
        meal_type,
        price,
    } = req.body;

    if (
        !name ||
        !description ||
        !category ||
        !cuisine_type ||
        !isVegetarian ||
        !meal_type ||
        !price
    ) {
        return next(new ErrorHandler('Enter all fields!', 400));
    }
    try {

        let restaurentMenu: MenuTypes | null = await Menu.findOne({ restaurant_id: req.params.restaurentId });

        if (!restaurentMenu) {
            restaurentMenu = await Menu.create({ restaurant_id: req.params.restaurentId });
        }

        restaurentMenu.menu_items.push({
            name,
            description,
            category,
            cuisine_type,
            isVegetarian,
            meal_type,
            price,
        });

        await restaurentMenu.save();

        res.status(200).json({
            success: true,
            restaurentMenu,
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Server Issue ', 500));
    }
});