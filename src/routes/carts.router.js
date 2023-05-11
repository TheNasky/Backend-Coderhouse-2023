import { Router } from "express";
import CartManager from "../cartsManager.js";
export const cartsRouter = Router();

const cartManager = new CartManager ("src/db/carts.json");

cartsRouter.get("/:cid", async (req, res) => {
    try {
        const id = req.params.cid
        const cartIfExists = await cartManager.getCartById(id)
        if(cartIfExists){
            res.status(200).json({
                status:"Success",
                msg:`Displaying all products from cart ${id}`,
                data:cartIfExists.products
            })
        }else{
            res.status(200).json({
                status:"Error",
                 msg:`Cart ${id} does not exist`
                })
        }
   } catch (error) {
       console.log("Unknown error ", error)
   }
})

 cartsRouter.post("/", async (req, res)=> {
    try {
        const product = req.body;   
        const addCart = await cartManager.createCart(product);
        if(!addCart){
            res.status(200).json({
                status:"Success",
                msg:"Cart created with product:",   
                data: product
            })
        }else{
            res.status(400).json({
                status:"Error",
                msg:"Error creating cart",
            })
        }
    } catch (error) {
        console.log("Unknown error ", error);
    }
 })

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const addToCart = await cartManager.addProductToCart(cid,pid)
        if(!addToCart){
            res.status(200).json({
                status:"Success",
                msg:`product ${pid} added to cart ${cid}`,
                data: await cartManager.getCartById(cid)
            })
        }else{
            res.status(400).json({
                status:"Error",
                msg:"Error adding product to cart",
            })
        }
    } catch (error) {
        console.log("Error add product in cart", error); 
    }
 })

    cartsRouter.delete("/:cid/products/:pid", async (req, res) =>{
        try {
            const cid = req.params.cid
            const pid = req.params.pid
            const removeFromCart = await cartManager.removeProductFromCart(cid, pid)
            if(!removeFromCart){
                res.status(200).json({
                    status:"Success",
                    msg:`product ${pid} removed from cart ${cid}`,
                    data: await cartManager.getCartById(cid)
                })
            }else{
                res.status(400).json({
                    status:"Error",
                    msg:"Error deleting product from cart",
                })
            }
        } catch (error) {
            console.log("Error add product in cart", error); 
        }
    })