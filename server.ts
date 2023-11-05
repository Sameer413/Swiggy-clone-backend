import { app } from "./app";
import { connectDB } from "./utils/database";
require('dotenv').config();

app.listen(5000, () => {
    console.log(`Server is connected with PORT: ${process.env.PORT}`);
    connectDB();
})