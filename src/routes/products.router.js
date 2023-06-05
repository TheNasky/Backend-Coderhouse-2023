import { Router } from "express";
export const productsRouter = Router();
import { ProductsModel } from "../models/products.model.js";


productsRouter.get("/", async (req, res) => {
    try {
        const products = await ProductsModel.find({});
        return res.status(200).json({
            status: "Success",
            msg: "Product List",
            data: products,
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


productsRouter.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const products = await ProductsModel.find({});
        return res.status(200).json({
            status: "Success",
            msg: "Product List",
            data: products,
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

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    try {
        if (!title || !description || !code || !price || !status || !stock || !category) {
            console.log("Validation error: please complete all fields.");
            return res.status(400).json({
            status: "error",
            msg: "Please complete all fields.",
            data: {},
            });
        }
  
        const product = await ProductsModel.create({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
        });
  
        return res.status(201).json({
            status: "success",
            msg: "Product created",
            data: product,
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
  

productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;
    try {
        if (!title || !description || !code || !price || !status || !stock || !category) {
            console.log("Validation error: please complete all fields.");
            return res.status(400).json({
            status: "error",
            msg: "Please complete all fields.",
            data: {},
            });
        }
        const productUpdated = await ProductsModel.findByIdAndUpdate(
            id,
            {title,description,code,price,status,stock,category,},
            { new: true }
        );
  
        return res.status(200).json({
            status: "success",
            msg: "Product updated",
            data: productUpdated,
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
  
productsRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await UserModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: "success",
            msg: "product deleted",
            data: {},
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});
  