import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
const port=process.env.PORT || 4000;

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

import authRouter from "./routes/auth.routes.js";
import cookieParser from 'cookie-parser';
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port,()=>{
    connectDB();
    console.log(`Server is running on port ${port}`);
});

