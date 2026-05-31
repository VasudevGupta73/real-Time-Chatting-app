import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from "./routes/auth.routes.js";
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import { app, server } from './socket/socket.js';

const port = process.env.PORT || 4000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
    credentials: true
}));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message",messageRouter);
server.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});

