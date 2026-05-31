import express from 'express';
import isAuth from "../middleware/isAuth.js";
import {upload} from "../middleware/multer.js";
import { getMessages, sendMessage } from "../controller/message.controller.js";
const messageRouter = express.Router();
messageRouter.post("/send/:receiver", isAuth, upload.fields([{name:"image", maxCount:1},{name:"video", maxCount:1}]), sendMessage);
messageRouter.get("/:receiver", isAuth, getMessages);
export default messageRouter;