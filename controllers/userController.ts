import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import { User, getUser, getUserById } from "../models/userModel";
import bcrypt from 'bcrypt';
import ErrorHandler from "../utils/ErrorHandler";
import sendToken from "../utils/sendToken";
import { UserType } from "../types/userTypes";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import { getDataUri } from "../utils/dataUri";
import cloudinary from "cloudinary";

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

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ErrorHandler('Enter correct password', 400));
        }

        sendToken(res, user, `Welcome Back 🙂${user?.name || 'Bro'}`);
    } catch (err) {
        console.log(err);
        next(new ErrorHandler(`Failed to Sign In`, 500));
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

export const updatePassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { password, newPassword, confirmPassword } = req.body;

    if (!password || !newPassword || !confirmPassword) {
        return next(new ErrorHandler('Enter all fields', 403));
    }

    const user: UserType = await User.findById(req.user?._id).select('+password');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(new ErrorHandler('Password', 400));
    }

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler('newPassword and confirmPassword not matching', 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
        success: true,
        messaage: 'Password updated successfully!'
    });
});

export const updateProfile = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, mobile, email } = req.body as UserType;

    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (name) {
            user.name = name;
        }

        if (mobile) {
            user.mobile = mobile;
        }

        if (email) {
            const checkUserWithEmail = await getUser(email);
            if (checkUserWithEmail) {
                return next(new ErrorHandler('Account already exists with this email!', 400));
            }
            user.email = email;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user,
        })

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to updated profile!', 500));
    }
});

export const sendResetPasswordEmail = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUser(req.body.email);

    if (!user) {
        return next(new ErrorHandler('User not found!', 404));
    }

    try {
        const resetPassToken: string = crypto.randomBytes(15).toString("hex");

        user.resetPasswordToken = crypto.createHash("sha256").update(resetPassToken).digest("hex");
        user.resetPasswordExpire = new Date(Date.now() + 1 * 60 * 1000);

        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${req.protocol}://${req.get(
            "host"
        )}/api/password/reset/${resetPassToken}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;


        await sendEmail({
            email: user.email,
            subject: 'Recovery',
            message
        });

        res.status(200).json({
            resetPassToken,
            user
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler('eerr', 500));
    }
});

export const resetPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resetPassToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: resetPassToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Password does not password", 400));
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Now you can login'
        })
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Error while reseting password', 500));
    }
});

export const addUserAddress = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { address, city, state, postal_code, country, street } = req.body;

    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        user.address?.push({ address, city, state, postal_code, country, street });

        await user.save();

        res.status(200).json({
            success: true,
            user,
            message: 'Address saved'
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to save address', 500));
    }
});

export const deleteUserAddress = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: UserType | null = await getUserById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler('user not found', 404));
        }

        const addressIndex = await user.address?.findIndex((item) => item._id?.toString() === req.body.addressId);

        if (addressIndex === -1 || addressIndex === undefined) {
            return next(new ErrorHandler('Address not found', 404));
        }

        await user.address?.splice(addressIndex, 1);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully!'
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to delete address', 500));
    }
});

export const deleteUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: UserType | null = await getUserById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler('user not found', 404));
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully!'
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Failed to delete user', 500));
    }
});

// export const testingRoute = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const data: any = req.file;

//     const fileUri = getDataUri(data);

//     // const myCloud = await cloudinary.v2.uploader.upload(fileUri.content || '', { folder: 'UserAvatar' });
//     // take data from myCloud.secure_url and myCloud.public_id
//     // save it in user schema done

//     res.status(200).json({
//         data
//     })
// })