import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import { Cart } from "../models/cartModel";
import ErrorHandler from "../utils/ErrorHandler";

export const showCartItems = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user?._id });

        if (!cart) {
            return next(new ErrorHandler('Add Items to the Cart', 403));
        }
        const restoId = cart.restaurent_id;

        const cartItems = cart.items;

        res.status(200).json({
            success: true,
            cartItems,
            restoId
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to load cart Items', 500));
    }

});

export const addCartItem = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {
        menuItemId,
        name,
        price,
        specialInstructions,
        total
    } = req.body;

    const restaurentId = req.params.restaurentId;

    if (!restaurentId) {
        return next(new ErrorHandler('Restaurent Id not found', 404));
    }

    try {
        let cart = await Cart.findOne({ user_id: req.user?._id, restaurent_id: restaurentId });

        if (!cart) {
            cart = await Cart.create({ user_id: req.user?._id, restaurent_id: restaurentId });

            await cart.items.push({
                menuItemId: menuItemId || null,
                name: name,
                quantity: 1,
                price: price,
                specialInstructions: specialInstructions || null,
                total: total
            });

        } else {

            const itemPresent = await cart.items.find((item) => item.menuItemId.toString() === menuItemId);

            if (itemPresent) {
                return next(new ErrorHandler('Item already added!', 403));
            }

            if (cart.restaurent_id.toString() !== restaurentId) {
                return next(new ErrorHandler('You cannot order from multiple restaurent at once', 403));
            }

            cart.items.push({
                menuItemId: menuItemId || null,
                name: name,
                quantity: 1,
                price: price,
                specialInstructions: specialInstructions || null,
                total: total
            });

        }

        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Item added to cart!'
        });

    } catch (error) {
        console.log(error);

        return next(new ErrorHandler('Failed to add item in the cart', 500));
    }
});

export const updateCartItem = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const { specialInstructions, qty, total } = req.body;

    try {
        const cart = await Cart.findOne({ user_id: req.user?._id, _id: req.body.cartId });

        if (!cart) {
            return next(new ErrorHandler('Cart not found', 404));
        }

        const cartItemId = req.body.cartItemId;

        if (!cartItemId) {
            return next(new ErrorHandler('missing cart item id', 404));
        }

        const itemIndex = cart.items.findIndex((item) => item._id?.toString() === cartItemId);

        if (itemIndex === -1) {
            return next(new ErrorHandler('Cart item not found', 404));
        }

        cart.items[itemIndex].specialInstructions = specialInstructions || null;

        if (qty === 'inc') {

            cart.items[itemIndex].quantity = cart.items[itemIndex].quantity + 1;

            cart.items[itemIndex].total = total;

        } else if (qty === 'dec') {

            if (cart.items[itemIndex].quantity !== 1) {
                cart.items[itemIndex].quantity = cart.items[itemIndex].quantity - 1;
                cart.items[itemIndex].total = total;

            } else {
                cart.items.splice(itemIndex, 1);
            }

        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Updated cart item'
        })


    } catch (error) {
        return next(new ErrorHandler('Failed to update item in the cart', 500));
    }
});

export const removeCartItem = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const cart = await Cart.findOne({ user_id: req.user?._id, _id: req.body.cartId });

        console.log(cart);

        if (!cart) {
            return next(new ErrorHandler('Cart not found', 404));
        }

        const cartItemId = req.body.cartItemId;

        const itemIndex = cart.items.findIndex((item) => item._id?.toString() === cartItemId);

        if (itemIndex === -1) {
            return next(new ErrorHandler('Cart item not found', 404));
        }

        await cart.items.splice(itemIndex, 1);

        await cart.save();

        if (cart.items.length <= 0) {
            await cart.deleteOne();
        }

        res.status(200).json({
            success: true,
            message: 'Item removed from the cart'
        });

    } catch (error) {
        return next(new ErrorHandler('Failed to delete item in the cart', 500));
    }
});
