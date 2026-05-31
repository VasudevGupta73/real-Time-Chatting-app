import { response } from "express";
import jwt from "jsonwebtoken";
const genToken=async(userId)=>{ 
    try{
        const token=jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
        return token;
    }
    catch(error){
        console.error("Error generating token:", error);
        throw new Error("Error generating token")
        return response.status(500).json({ message: "Internal server error" });
    }
}
export default genToken;