import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {

        let sender=req.userId;
        let {receiver}=req.params;
        let {message}=req.body;

        let image;
        if(req.files?.image){
            image=await uploadOnCloudinary(req.files.image[0].path);
        } 
        let conversation=await Conversation.findOne({
            participants:{$all:[sender,receiver]},
        })
        let newMessage=await Message.create({
            sender, receiver, message, image
        })
        if(!conversation){
            conversation=await Conversation.create({
                participants:[sender,receiver],
                messages:[newMessage._id],
            })
        }
        else{
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }
        const recieverSocketId=getRecieverSocketId(receiver);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",newMessage);
        }
        return res.status(201).json({
            newMessage,
            success:true,
            message:"message sent successfully",
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false,
        })

    }

}


export const getMessages = async (req, res) => {
    try{
        let sender=req.userId;
        let {receiver}=req.params;
        let conversation=await Conversation.findOne({
            participants:{$all:[sender,receiver]},
        }).populate("messages");
        if(!conversation){
            return res.status(404).json({
                message:"conversation not found",
                success:false,
            })
        }
        return res.status(200).json({
            messages:conversation?.messages,
            success:true,
            message:"messages fetched successfully",
        })
        
        
    }catch(error){
        return res.status(500).json({
            message:error.message,
            success:false,
        })

    }
}

