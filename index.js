import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./Routes/users.js";
import commentRoutes from "./Routes/comments.js";
import videoRoutes from "./Routes/videos.js";
import photoRoutes from "./Routes/photos.js";
import authRoutes from "./Routes/auth.js";
import payRoutes from './Routes/pay.js';
import contactRoutes from './Routes/contacts.js';
import cookieParser from "cookie-parser";
import Razorpay from 'razorpay';
import cors from "cors";

const app = express();
dotenv.config();

const connect = () => {
    mongoose.set('strictQuery', false);
    mongoose
        .connect(process.env.MONGO)
        .then(() => {
            console.log("Connected to DB");
        })
        .catch((err) => {
            throw err;
        });
}; 

export const instance = new Razorpay({
    key_id: process.env.RZP_KEY_ID,
    key_secret: process.env.RZP_SECRET_KEY,
});

const allowedOrigins = ['http://localhost:3000', 'https://iiitusnapshots.netlify.app/']; // Add your frontend URLs


app.use(cors({
  origin: allowedOrigins,
  credentials: true // Allow cookies to be sent
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/pay", payRoutes);
app.use("/api/contacts", contactRoutes);

app.get("/api/getkey", (req, res, next) => res.status(200).json({ key: process.env.RZP_KEY_ID }));

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "something went wrong";
    return res.status(status).json({
        success: false,
        status: status,
        message: message,
    });
});

app.listen(8800, () => {
    connect();
    console.log("Connected to Server");
});
