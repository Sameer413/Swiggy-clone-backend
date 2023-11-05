import { Schema, model } from "mongoose";
import { UserType } from "../types/userTypes";


const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const userSchema = new Schema<UserType>({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Enter you email!"],
        unique: true,
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: "please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Enter you password!"],
        select: false,
        minlength: [8, "Password must be at least 8 characters"],
    },
    address: [
        {
            address: {
                type: String,
            },
            country: {
                type: String,
            },
            postal_code: {
                type: Number,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            street: {
                type: String,
            },
        }
    ],
    role: {
        type: String,
        default: "user",
    },
})

export const User = model<UserType>('User', userSchema);

export const getUserById = async (id: String) => {
    if (!id) {
        throw "Oi! You forgot to pass an id";
    }

    const user = await User.findById(id);
    return user;
}

export const getUser = async (email: String) => {
    if (!email) {
        throw "Oi! You forgot to pass an email";
    }
    const user = await User.findOne({ email });
    return user;
}