import { Router } from "express";
export const messagesRouter = Router();
import { MessagesModel } from "../DAO/models/messages.model.js";


messagesRouter.get("/", async (req, res) => {
    try {
        const messages = await MessagesModel.find({});
        return res.status(200).json({
            status: "Success",
            msg: "Message List",
            data: messages,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
            data: {},
        });
    }
});

messagesRouter.post("/", async (req, res) => {
    const {user,message} = req.body;
    try {
        if (!message) {
            console.log("error, please type a message before sending");
            return res.status(400).json({
            status: "error",
            msg: "Please type a message before sending",
            data: {},
            });
        }else{
            const socketServer = req.socketServer;    
            socketServer.sockets.emit('refresh', 'refresh');  
            const createdMessage = await MessagesModel.create({
                user,
                message,
            });
            return res.status(201).json({
                status: "success",
                msg: "message sent",
                data: user + ": " +message,
            });
            
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
            data: {},
        });
    }
});