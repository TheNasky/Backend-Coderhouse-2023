import { Router } from "express";
import __dirname from "../utils.js"
import ProductManager from "../productManager.js";

export const viewsRouter = Router();

const manager = new ProductManager("src/db/products.json");

viewsRouter.get("/",(req,res)=>{
    res.status(200).render("index",{name:"roberto"})
})

viewsRouter.get("/home", async (req,res)=>{
    const products = await manager.getProducts()
    const list = {
        products:products,
        style:"home.css"
    }
    res.status(200).render("home",list)
})

viewsRouter.get("/realTimeProducts",async (req,res)=>{
    const products = await manager.getProducts()
    const list = {
        products:products,
        style:"home.css"
    }
    res.status(200).render("realTimeProducts",list)
})