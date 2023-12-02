import { Schema, model } from "mongoose";
import { UserType } from "../types/userTypes";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const userSchema = new Schema<UserType>({
    name: {
        type: String,
    },
    mobile: {
        type: Number,
        match: /^[0-9]{10}$/,
        unique: true,
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
    avatar: {
        public_id: {
            type: String,
            // required: [true, "Avatar Public id is required!"],
        },
        url: {
            type: String,
            // required: [true, "avatar url is required!"],
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
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

// userSchema.methods.getResetPassToken = function () {
//     const resetToken: string = crypto.randomBytes(15).toString("hex");

//     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//     return resetToken;
// }