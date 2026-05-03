import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
const port=process.env.PORT || 4000;

const app=express();


app.listen(port,()=>{
    connectDB();
    console.log(`Server is running on port ${port}`);
});

