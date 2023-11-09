import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import { RestaurentModelType } from "../types/restaurentTypes";
import ErrorHandler from "../utils/ErrorHandler";
import { Restaurent } from "../models/restaurentModel";
import ApiFeature from "../utils/apiFeatures";

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
        console.log(error);
        return next(new ErrorHandler('Failed to create restaurent', 500));

    }
});

export const updateRestaurent = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    try {
        const restaurent = await Restaurent.findOne({ id: req.params.restaurentId, user_id: req.user?.id });

        if (!data) {
            return next(new ErrorHandler('Enter fields to update data', 400));
        }

    } catch (error) {

    }
});

export const deleteRestaurent = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurent = await Restaurent.findOne({ id: req.params.restaurentId, user_id: req.user?._id });

        if (!restaurent) {
            return next(new ErrorHandler('Restuarent not found', 404));
        }

        await restaurent.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Your Online Restuarent Service is deleted!'
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Problem while deleting restuarent service', 500));
    }
});

interface RestuarentQueryParams {
    restaurent_name?: string;
    city?: string;
    restaurent_type?: string;
    cuisine?: string;
}

export const getAllRestaurent = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiFeature = new ApiFeature(Restaurent.find(), req.query).search();

        let resto = await apiFeature.query;

        res.status(200).json({
            resto
        })
    } catch (error) {

    }

})