import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import { Order } from "../models/orderModel";
import { OrderTypes } from "../types/orderTypes";
import { Cart } from "../models/cartModel";
import ErrorHandler from "../utils/ErrorHandler";

export const makeOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const customer_id = req.user?._id;
    const restaurent_id = req.params.restaurentId;

    const cart = await Cart.findOne({ user_id: customer_id, restaurent_id: restaurent_id });

    if (!cart) {
        return next(new ErrorHandler('Cart not found for order', 404));
    }

    const orderItems = cart.items;

    if (orderItems.length <= 0) {
        return next(new ErrorHandler('No order Items found', 404));
    }

    const {
        subTotal,
        taxesAndFees,
        discount,
        deliveryFee,
        grandTotal,
        orderNotes,
        paymentMethod,
        transactionId,
    } = req.body;

    try {
        const order: OrderTypes = await Order.create({
            user_id: customer_id,
            restaurent_id: restaurent_id,
            orderStatus: [
                {
                    status: 'Pending',
                    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                }
            ],
            orderNotes: orderNotes || null,
            orderTotal: {
                deliveryFee: deliveryFee,
                taxesAndFees: taxesAndFees,
                discount: discount,
                grandTotal: grandTotal,
                subTotal: subTotal,
            },
            paymentInformation: {
                paymentMethod: paymentMethod,
                transactionId: transactionId || undefined,
            },
            items: orderItems,
            timestamp: {
                orderPlacement: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            }
        });

        res.status(200).json({
            success: true,
            message: 'Order Placed!',
            order,
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to place order please try again later', 500));
    }

});

export const getAllRestaurentOrders = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const orders = await Order.find({ restaurent_id: req.params.restaurentId });

    if (!orders) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});

export const getAllUserOrders = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find({ user_id: req.user?._id });

        if (!orders) {
            return next(new ErrorHandler('Orders not found', 404));
        }

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to load orders', 500));
    }
})


export const getSingleOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const orders = await Order.findOne({ restaurent_id: req.params.restaurentId, _id: req.body.orderId });

    if (!orders) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});

export const updateOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId });

        const { status } = req.body;

        if (!order) {
            return next(new ErrorHandler('Order not found', 404));
        }

        order.orderStatus.push({
            status: status,
        });

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order Updated'
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to update order', 500));
    }
});

export const postReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findById({ _id: req.params.orderId });
        const { rating, feedbackText }: { rating?: number | null, feedbackText?: string | null } = req.body;

        if (!order) {
            return next(new ErrorHandler('order not found', 404));
        }

        const isDelivered = await order.orderStatus.some((status) => status.status === 'delivered');

        if (!isDelivered) {
            return next(new ErrorHandler('Order must be delivered before adding review', 403));
        }

        if (order.feedbackAndRating?.feedbackText || order.feedbackAndRating?.rating) {
            return next(new ErrorHandler('You already give rating and feedback', 403));
        }

        // Adding ratings and reviews
        order.feedbackAndRating = {
            rating: rating ? rating : undefined,
            feedbackText: feedbackText ? feedbackText : undefined,
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Review added successfully',
            isDelivered
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to add feedback and rating', 500));
    }

});

export const showRestaurentReviews = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find({ restaurent_id: req.params.restaurentId });

        if (!orders) {
            return next(new ErrorHandler('No orders found', 404));
        }

        const ordersWithReviews = await orders.filter((order) => order.feedbackAndRating?.feedbackText || order.feedbackAndRating?.rating)

        const feedbackAndRating = await ordersWithReviews.map((order) => order.feedbackAndRating);

        if (!feedbackAndRating) {
            return next(new ErrorHandler('No Reviews yet', 404));
        }

        res.json({
            success: true,
            feedbackAndRating
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to load reviews', 500));
    }

});