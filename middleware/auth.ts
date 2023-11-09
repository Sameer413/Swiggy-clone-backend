import { NextFunction, Request, Response, request } from "express";
import catchAsyncError from "./catchAsyncError";
import jwt from "jsonwebtoken";
import { getUserById } from "../models/userModel";
import { UserType } from "../types/userTypes";
import ErrorHandler from "../utils/ErrorHandler";

export const isAuthenticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Please Login to access', 400));
    }

    const decodedData: any = jwt.verify(token, 'sfdsfdf');

    req.user = await getUserById(decodedData.id);

    next();
})

export const isAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'user') {
        next();
    }

    return next(new ErrorHandler(`${req.user?.role} not allowed to access these resources`, 403))
});