import Razorpay from "razorpay";
import { app } from "./app";
import { connectDB } from "./utils/database";
require('dotenv').config();
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const RazorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY!,
    key_secret: process.env.RAZORPAY_API_SECRET
});


app.listen(5000, () => {
    console.log(`Server is connected with PORT: ${process.env.PORT}`);
    connectDB();
})