import { Response } from 'express';
import generateToken from './jwtToken';
import { UserType } from '../types/userTypes';


const sendToken = (
    res: Response,
    user: UserType,
    message: string,
    statusCode: number = 200
): void => {
    const token: string = generateToken(user._id);

    res.status(statusCode)
        .cookie('token', token, {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        .json({
            success: true,
            message,
            user,
        });
}

export default sendToken;       