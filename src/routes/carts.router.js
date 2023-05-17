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
        const CartId = await cartManager.createCart(product);
        res.status(200).json({
            status:"Success",
            msg:`Cart created with id: ${CartId}`,   
            data: await cartManager.getCartById(CartId)
        })
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
                msg:addToCart,
            })
        }
    } catch (error) {
        console.log("Unknown error ", error); 
    }
 })

    // cartsRouter.delete("/:cid/products/:pid", async (req, res) =>{
    //     try {
    //         const cid = req.params.cid
    //         const pid = req.params.pid
    //         const removeFromCart = await cartManager.removeProductFromCart(cid, pid)
    //         if(!removeFromCart){
    //             res.status(200).json({
    //                 status:"Success",
    //                 msg:`product ${pid} removed from cart ${cid}`,
    //                 data: await cartManager.getCartById(cid)
    //             })
    //         }else{
    //             res.status(400).json({
    //                 status:"Error",
    //                 msg:"Error deleting product from cart",
    //             })
    //         }
    //     } catch (error) {
    //         console.log("Error add product in cart", error); 
    //     }
    // })