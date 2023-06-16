import { Router } from "express";
import __dirname from "../utils.js"
import ProductsModel from "../DAO/models/products.model.js";
import MessagesModel from "../DAO/models/messages.model.js";
import {getAllProductsRender} from "../controllers/viewsController.js"

export const viewsRouter = Router();



viewsRouter.get("/",(req,res)=>{
    res.status(200).render("index",{name:"roberto"})
})

viewsRouter.get("/home", async (req,res)=>{
    const products = await ProductsModel.find({}).lean().exec();
    const list = {
        products:products,
        style:"home.css"
    }
    res.status(200).render("home",list)
})


viewsRouter.get("/realTimeProducts",async (req,res)=>{
    const products = await ProductsModel.find({}).lean().exec();
    const list = {
        products:products,
        style:"home.css"
    }
    res.status(200).render("realTimeProducts",list)
})

viewsRouter.get("/chat",async (req,res)=>{
    const messages = await MessagesModel.find({}).sort({_id:-1}).limit(25).lean().exec();
    const reversedMessages = messages.reverse()
    const list = {
        messages:reversedMessages,
        style:"chat.css"
    }
    res.status(200).render("chat",list)
})

viewsRouter.get("/products",getAllProductsRender)