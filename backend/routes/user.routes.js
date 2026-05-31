import express from 'express';
import isAuth from '../middleware/isAuth.js';
const userRouter = express.Router();
import { upload } from '../middleware/multer.js';
import { editProfile, getCurrentUser, getOtherUsers,search } from '../controller/user.controllers.js';
userRouter.get('/others',isAuth,getOtherUsers);    
userRouter.get('/current', isAuth, getCurrentUser);
userRouter.put('/profile', isAuth, upload.single('image'), editProfile);
userRouter.get("/search",isAuth,search);

export default userRouter;