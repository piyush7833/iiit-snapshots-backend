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

// app.use(cors({
//     origin: true,
//     credentials: true
// }));
// app.use(cors());
app.use((req, res, next) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://192.168.1.9:3000",
    ];
    const origin = req.headers.origin;
    console.log(origin);
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    return next();
  });
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
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:3000`);
    res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    
    return res.status(status).json({
        success: false,
        status: status,
        message: message
    })
})


// // Add the following middleware to handle preflight requests
app.options('*', cors({
    origin: ['http://localhost:3000', 'https://example.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
    preflightContinue: true
}));

app.listen(8800, () => {
    connect();
    console.log("Connected to Server");
});
