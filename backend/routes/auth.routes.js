 import express from "express";
 
 const authRouter=express.Router();

 import { signUp,login,logOut } from "../controller/auth.controllers.js";

 authRouter.post("/signup", signUp);
 authRouter.post("/login", login);
 authRouter.post("/logout", logOut);


 export default authRouter;