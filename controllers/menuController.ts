import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { MenuTypes } from "../types/menuTypes";
import { Menu } from "../models/menuModel";

export const getAllMenuByRestaurentId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const restaurentMenu: MenuTypes | null = await Menu.findOne({ restaurant_id: req.params.restaurentId });

    if (!restaurentMenu) {
        return next(new ErrorHandler('Menu not found', 404));
    }

    try {
        const menuItems = await restaurentMenu.menu_items;

        if (menuItems.length >= 0) {
            res.status(200).json({
                success: true,
                menuItems
            })
        } else {
            return next(new ErrorHandler('No Menu Items found', 404));
        }

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to load menu items', 500));
    }
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

export const deleteMenuItem = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurentMenu: MenuTypes | null = await Menu.findOne({ restaurant_id: req.params.restuarentId });

        if (!restaurentMenu) {
            return next(new ErrorHandler('Menu not find', 404));
        }

        const menuItemIndex = await restaurentMenu.menu_items.findIndex((item) => item._id?.toString() === req.params.menuId);

        if (menuItemIndex === -1) {
            return next(new ErrorHandler('Menu Item not found', 404));
        }

        await restaurentMenu.menu_items.splice(menuItemIndex, 1);

        await restaurentMenu.save();

        res.status(200).json({
            success: true,
            message: `Menu Item deleted successfully!`
        })
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to delete menu Item', 500));

    }
});

export const updateMenuItem = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        price,
        description,
        cuisine_type,
        isVegetarian,
        meal_type,
        category
    } = req.body;

    try {
        const restaurentMenu: MenuTypes | null = await Menu.findOne({ restaurant_id: req.params.restuarentId });

        if (!restaurentMenu) {
            return next(new ErrorHandler('Menu not find', 404));
        }

        const menuItem = await restaurentMenu.menu_items.find((item) => item._id?.toString() === req.params.menuId);

        if (!menuItem) {
            return next(new ErrorHandler('Menu Item not found', 404));
        }
        // need to pass 0 1 for true or false in json
        // Updating fields of Menu Item
        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.category = category || menuItem.category;
        menuItem.cuisine_type = cuisine_type || menuItem.cuisine_type;
        menuItem.isVegetarian = isVegetarian || menuItem.isVegetarian;
        menuItem.meal_type = meal_type || menuItem.meal_type;
        menuItem.price = price || menuItem.price;

        await restaurentMenu.save();

        res.status(200).json({
            success: true,
            message: `Menu Item updated successfully!`
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to update menu Item', 500));
    }
});