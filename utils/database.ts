import mongoose from "mongoose";

export const connectDB = () => {
    const dbUrl = process.env.DATABASE_URL || ''
    mongoose.connect(dbUrl, {
        dbName: "test"
    });

    const db = mongoose.connection;

    db.on("error", (error: any) => console.error(error));
    db.once("open", () => {
        console.log("Connected to MongoDB");
    });
}