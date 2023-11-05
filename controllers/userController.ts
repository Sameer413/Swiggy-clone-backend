import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import { User, getUser } from "../models/userModel";
import bcrypt from 'bcrypt';
import ErrorHandler from "../utils/ErrorHandler";
import sendToken from "../utils/sendToken";
import { UserType } from "../types/userTypes";


export const signUp = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        next(new ErrorHandler('Enter All Fields', 400));
    }

    const user = await getUser(email);
    if (user) {
        return next(new ErrorHandler('User already exists!', 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler('Password not matching', 400));
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: UserType = await User.create({
            email,
            password: hashedPassword,
        })

        sendToken(res, newUser, `Swiggy Welcomes you ${newUser.name || null}`);

    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

export const signIn = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Enter all fields', 400));
    }

    try {
        const user: UserType = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        const isMatch = bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ErrorHandler('Password', 400));
        }

        sendToken(res, user, `Welcome Back 🙂${user?.name || 'Bro'}`);
    } catch (err) {
        next(new ErrorHandler(`${err}`, 500))
    }
});

export const signOut = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res
            .status(200)
            .cookie('token', null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
            .json({
                success: true,
                message: 'Signed Out Successfully!'
            });
    } catch (error) {
        return next(new ErrorHandler(`Error in Signing Out\n ${error}`, 500));
    }
});