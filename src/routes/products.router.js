import { Router } from "express";
import ProductManager from "../productManager.js";
export const productsRouter = Router();

const manager = new ProductManager("src/db/products.json");

productsRouter.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts()
        const limit = req.query.limit;
        if(products.length===0){
            return res.status(418).json({
                status:"Error 418", 
                msg:"Product list is empty",
            })
        }else if(limit){
            const result = products.slice(0, limit);
            return res.status(200).json({
                status:"Success",
                msg:`Displaying first ${limit} Products`,
                data: result.slice(0,limit)})
        }
        else {
            res.status(200).json({
                status:"Success",
                msg:`Displaying all products`,
                data: products})
        }
    } catch (error) {
        console.log("Unknown error ", error)
    }});


productsRouter.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await manager.getProductById(id)
        if(product){
            return res.status(200).json({
                status:"Success",
                msg:`Displaying product ${id}`,
                data:product
            });
        }else{
            return res.status(400).json({
                status:"Error",
                msg:`Product ${id} does not exist`
            });

        };
    } catch (error) {
       console.log("Unknown error ", error)
    }
});

productsRouter.post("/", async (req, res) =>{
    try {
        const newProduct = req.body;
        const add = await manager.addProduct(newProduct);
        if (!add) {
            return res.status(200).json({
                status:"Success",
                msg:"Product added succesfully",
                data:newProduct
            });
        }else{
            return res.status(400).json({
                status:"Error",
                msg:add,
            });
        }
    } catch (error) {
        console.log("Unknown error ", error)
    }
})

productsRouter.put("/:pid", async (req, res) => {
    try {
            const id = req.params.pid;
            const product= req.body;
            const updateProduct = await manager.updateProduct(id,product);
            if (!updateProduct) {
                return res.status(200).json({
                    status:"Success",
                    msg:"Product Updated",
                    data:manager.products[id]
                });
            }else{
                return res.status(400).json({
                    status:"Error",
                    msg:"Error updating Product",
                });
            }
        } catch (error) {
            console.log("Unknown error ", error)
        }
        
});

productsRouter.delete("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await manager.getProductById(id)
        if (!product) {
            return res.status(400).json({
                status:"Error",
                msg:"Product does not exist"
            });
        } else {
            await manager.deleteProduct(id)
            return res.status(200).json({
                status:"Success",
                msg:`Product ${id} deleted successfully`,
                data: product
            });
        }
    } catch (error) {
        console.log("Unknown error ", error)
    }
})