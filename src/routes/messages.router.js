import { Router } from "express";
import { getMessages,postMessages } from "../controllers/messages.controller.js";
export const messagesRouter = Router();



messagesRouter.get("/",getMessages);

messagesRouter.post("/", postMessages);