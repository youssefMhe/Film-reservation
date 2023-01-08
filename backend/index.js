import express from "express"
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from "./routes/user-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import movieRoutes from "./routes/movie-routes.js";
import bookingRoutes from "./routes/booking-routes.js";

dotenv.config()

const app = express();
app.use(express.json())

//middlewares
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/booking", bookingRoutes);
mongoose.connect(`mongodb+srv://${process.env.MongoDB_User_Name}:${process.env.MongoDB_User_Password}@cluster0.rhj6hqo.mongodb.net/?retryWrites=true&w=majority`).then(() => app.listen(5001)).then(() =>
    console.log('connect with success  to MongoDB -- 5001 --')).catch((err) => console.log(err))

