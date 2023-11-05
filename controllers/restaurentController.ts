import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import { RestaurentModelType } from "../types/restaurentTypes";
import ErrorHandler from "../utils/ErrorHandler";
import { Restaurent } from "../models/restaurentModel";

export const createRestaurent = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {
        restaurent_name,
        description,
        opening_time,
        closing_time,
        restaurent_type,
        cuisine,
        address: {
            address,
            city,
            country,
            postal_code,
            state,
            landmark,
        }
    } = req.body as RestaurentModelType;

    if (
        !restaurent_name ||
        !description ||
        !opening_time ||
        !closing_time ||
        !restaurent_type ||
        !cuisine ||
        !address ||
        !city ||
        !country ||
        !postal_code ||
        !state
    ) {
        return next(new ErrorHandler('Enter all fields!', 400));
    }

    try {
        const restaurent = await Restaurent.create({
            user_id: req.user?._id,
            restaurent_name,
            description,
            opening_time,
            closing_time,
            address: {
                address: address,
                country: country,
                city: city,
                postal_code: postal_code,
                state: state,
                landmark: landmark
            },
            restaurent_type,
            cuisine,
        });

        res.status(200).json({
            success: true,
            restaurent
        })
    } catch (error) {

    }
})