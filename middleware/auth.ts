import { NextFunction, Request, Response, request } from "express";
import catchAsyncError from "./catchAsyncError";
import jwt from "jsonwebtoken";
import { getUserById } from "../models/userModel";
import { UserType } from "../types/userTypes";

export const isAuthenticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    const decodedData: any = jwt.verify(token, 'sfdsfdf');

    req.user = await getUserById(decodedData.id);

    next();
})