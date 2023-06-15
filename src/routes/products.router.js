import { Router } from "express";
export const productsRouter = Router();
import ProductsModel from "../DAO/models/products.model.js";


productsRouter.get("/", async (req, res) => {
    try {
        const limit =req.query.limit;
        const page =req.query.page;
        const sort =req.query.sort;
        const category = req.query.category;
        const inStock= req.query.inStock;
        let products
        let query = {};

        if (category) {
            query = { ...query, category: category };
        }
        if (inStock==="true") {
            query = { ...query, stock: {$gt: 0}};
        }
        if (inStock==="false") {
            query = { ...query, stock: 0};
        }

        if(sort){
            products= await ProductsModel.paginate(query,{limit:limit??10,page:page??1,sort:{price:sort??1}});
        }else{
            products= await ProductsModel.paginate(query,{limit:limit??10,page:page??1});
        }
        return res.status(200).json({
            status: "Success",
            payload:products.docs,
            totalPages:products.totalPages,
            prevPage:products.prevPage,
            nextPage:products.nextPage,
            page:products.page,
            hasPrevPage:products.hasPrevPage,
            hasNextPage:products.hasNextPage,
            prevLink:products.hasPrevPage==true ? "link" : null,  // no se como crear el link
            nextLink:products.hasNextPage==true ? "link" : null   // no se como crear el link
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
});


productsRouter.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await ProductsModel.find({_id : id});
        return res.status(200).json({
            status: "Success",
            msg: "Displaying Product: " + id,
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

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    try {
        if (!title || !description || !code || !price || !stock || !category) {
            console.log("Validation error: please complete all fields.");
            return res.status(400).json({
            status: "error",
            msg: "Please complete all fields.",
            data: {},
            });
        }else{
            const product = await ProductsModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
            });
            const socketServer = req.socketServer;
            socketServer.sockets.emit('refresh', 'refresh');
            return res.status(201).json({
                status: "success",
                msg: "Product created",
                data: product,
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
  

productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;
    try {
        if (!title || !description || !code || !price || !stock || !category) {
            console.log("Validation error: please complete all fields.");
            return res.status(400).json({
            status: "error",
            msg: "Please complete all fields.",
            data: {},
            });
        }else{
            const productUpdated = await ProductsModel.findByIdAndUpdate(
                id,
                {title,description,code,price,status,stock,category,},
                { new: true }
            );
            const socketServer = req.socketServer;
            socketServer.sockets.emit('refresh', 'refresh');
            return res.status(200).json({
                status: "success",
                msg: "Product updated",
                data: productUpdated,
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
  
productsRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ProductsModel.deleteOne({ _id: id });
        const socketServer = req.socketServer;
        socketServer.sockets.emit('refresh', 'refresh');
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
  