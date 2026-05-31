import http from "http";
import express from "express";
import { Server } from "socket.io";
let app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173","http://localhost:5174","http://localhost:5175","http://localhost:5176"],
        credentials:true
    }
})
const userSocketMap = {};
io.on("connection",(socket)=>{
   
    const userId=socket.handshake.query.userId;
    if(userId){
       userSocketMap[userId]=socket.id;
       io.emit("getOnlineUsers",Object.keys(userSocketMap));
    }
    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})
export const getRecieverSocketId=(receiverId)=>{
    return userSocketMap[receiverId];
}

export {app,server,io};