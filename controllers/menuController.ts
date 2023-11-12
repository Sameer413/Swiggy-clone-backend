import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { MenuTypes } from "../types/menuTypes";
import { Menu } from "../models/menuModel";
import { getDataUri } from "../utils/dataUri";
import cloudinary from "cloudinary";

export const getAllMenuByRestaurentId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const restaurentMenu: MenuTypes | null = await Menu.findOne({ restaurant_id: req.params.restaurentId });
    const { category, sortBy, search, veg }: { category?: string, sortBy?: 'asc' | 'desc', search?: string, veg?: boolean } = req.query;

    if (!restaurentMenu) {
        return next(new ErrorHandler('Menu not found', 404));
    }

    try {
        let menuItems = await restaurentMenu.menu_items;


        if (search) {

            const searchTerm = search.toLowerCase();
            menuItems = menuItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm)
            );

        } else {

            if (category) {
                menuItems = menuItems.filter(item => item.category === category)
            }

            if (sortBy === 'desc') {
                menuItems.sort((a, b) => b.price - a.price); // Sort in descending order
            } else {
                menuItems.sort((a, b) => a.price - b.price); // Sort in ascending order (default)
            }

            if (veg) {
                menuItems = menuItems.filter(item => item.isVegetarian === true);
            }
        }

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

    const menuImage: any = req.file;

    if (
        !name ||
        !description ||
        !category ||
        !isVegetarian ||
        !meal_type ||
        !price
    ) {
        return next(new ErrorHandler('Enter all fields!', 400));
    }

    let myCloud;

    try {

        let restaurentMenu: MenuTypes | null = await Menu.findOne({ restaurant_id: req.params.restaurentId });

        if (!restaurentMenu) {
            restaurentMenu = await Menu.create({ restaurant_id: req.params.restaurentId });
        }
        // validation for file if checking etc
        const fileUri = menuImage && getDataUri(menuImage);

        myCloud = await cloudinary.v2.uploader.upload(fileUri.content || '', { folder: `Menu/${req.params.restaurentId}` });

        restaurentMenu.menu_items.push({
            name,
            description,
            category,
            cuisine_type,
            isVegetarian,
            meal_type,
            price,
            dishImage: {
                public_url: myCloud && myCloud.public_id,
                url: myCloud && myCloud.secure_url
            }
        });

        await restaurentMenu.save();

        res.status(200).json({
            success: true,
            restaurentMenu,
        });

    } catch (error) {

        if (myCloud && myCloud.public_id) {
            await cloudinary.v2.uploader.destroy(myCloud.public_id);
        }

        console.log(error);
        return next(new ErrorHandler('Server Issue', 500));
    }
});

export const deleteMenuItem = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurentMenu: MenuTypes | null = await Menu.findOne({ restaurant_id: req.params.restaurentId });

        if (!restaurentMenu) {
            return next(new ErrorHandler('Menu not find', 404));
        }

        const menuItemIndex = await restaurentMenu.menu_items.findIndex((item) => item._id?.toString() === req.params.menuId);

        if (menuItemIndex === -1) {
            return next(new ErrorHandler('Menu Item not found', 404));
        }

        if (restaurentMenu.menu_items[menuItemIndex].dishImage?.public_url || restaurentMenu.menu_items[menuItemIndex].dishImage?.url) {
            await cloudinary.v2.uploader.destroy(restaurentMenu.menu_items[menuItemIndex].dishImage?.public_url || '');
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

    const menuImage: any = req.file;
    let myCloud;

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

        if (menuImage) {
            if (menuItem.dishImage?.public_url || menuItem.dishImage?.url) {
                await cloudinary.v2.uploader.destroy(menuItem.dishImage.public_url);
            }

            const fileUri = getDataUri(menuImage);
            myCloud = await cloudinary.v2.uploader.upload(fileUri.content || '', { folder: `Menu/${req.params.restaurentId}` });
        }
        console.log("heelooyeel");
        if (myCloud) {
            menuItem.dishImage = {
                public_url: myCloud?.public_id,
                url: myCloud?.secure_url
            }
        }
        console.log("heeloo");

        await restaurentMenu.save();

        res.status(200).json({
            success: true,
            message: `Menu Item updated successfully!`
        });

    } catch (error) {

        if (myCloud && myCloud.public_id) {
            await cloudinary.v2.uploader.destroy(myCloud.public_id).catch((destroyError) => {
                console.error('Error deleting image from Cloudinary:', destroyError);
            });
        }

        console.log(error);
        return next(new ErrorHandler('Failed to update menu Item', 500));
    }
});