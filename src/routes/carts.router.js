import { Router } from "express";
export const cartsRouter = Router();
import CartsModel from "../DAO/models/carts.model.js";
import ProductsModel from "../DAO/models/products.model.js";
import mongoose from "mongoose";

cartsRouter.get("/", async (req, res) => {
    try {
        const carts= await CartsModel.find({})
        return res.status(200).json({
            status: "Success",
            msg: "Displaying all carts",
            data: carts,
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
})

cartsRouter.get("/:cid", async (req, res) => {
    try{
        const cid = req.params.cid
        const cart= await CartsModel.findOne({_id:cid}).populate("items.idProduct");
        return res.status(200).json({
            status: "Success",
            msg: "Displaying Cart: " + cid,
            data: cart,
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
})
cartsRouter.post("/", async (req, res) => {
    try {
        const cart = CartsModel.create({})

        return res.status(200).json({
            status: "Success",
            msg: "Cart created",
            data:cart
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
 })

 cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid.trim();
        const cart = await CartsModel.findOne({ _id: cid })
        if (!cart) {
            return res.status(404).json({
                status: "Error",
                msg: "Cart " + cid + " not found"
            })
        }
        const product = await ProductsModel.findOne({ _id: pid })
        if (!product) {
            return res.status(404).json({
                status: "Error",
                msg: "Product " + pid + " not found"
            })
        }
        const productExists = await CartsModel.findOne({_id:cid,items:{$elemMatch:{idProduct:pid}}})
        if(productExists){
            const result = await CartsModel.findOneAndUpdate(
                {
                    _id: cid,
                    items: {
                        $elemMatch: { idProduct: pid }
                    }
                },
                {
                    $inc: { 'items.$.quantity': 1 }
                },
            );
            const cart2 = await CartsModel.findOne({ _id: cid })
            return res.status(200).json({
                status: "Success",
                msg: "Quantity increased by 1",
                data: cart2
            })
        }else{
            const cartWithNewProduct = await CartsModel.findOneAndUpdate(
                { _id: cid },
                { $push: { items: { idProduct: pid, quantity: 1 } } },
                { new: true }
            );
            const cart2 = await CartsModel.findOne({ _id: cid })
            return res.status(200).json({
                status: "Success",
                msg: "Product added to cart",
                data: cart2
            })
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
 })

 cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid.trim();
        const cart = await CartsModel.findOne({ _id: cid });
        if (!cart) {
            return res.status(404).json({
                status: "Error",
                msg: "Cart " + cid + " not found",
            });
        }
        const product = await ProductsModel.findOne({ _id: pid });
        if (!product) {
            return res.status(404).json({
                status: "Error",
                msg: "Product " + pid + " not found",
            });
        }
        const result = await CartsModel.findOneAndUpdate(
            { _id: cid },
            { $pull: { items: { _id: pid } } },
            { new: true }
        );
        const cart2 = await CartsModel.findOne({ _id: cid });
        return res.status(200).json({
            status: "Success",
            msg: "Product deleted from cart",
            data: cart2,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
});

cartsRouter.put("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid.trim();
        const products = req.body;
        if (!products) {
            return res.status(400).json({
                status: "Error",
                msg: "Missing 'products' in the body",
            });
        }
        const cart = await CartsModel.findOne({ _id: cid });
        if (!cart) {
            return res.status(404).json({
                status: "Error",
                msg: "Cart " + cid + " not found",
            });
        }
        const newItems = products.map((product) => ({
            idProduct: new mongoose.Types.ObjectId(product.idProd),
            quantity: product.cant,
        }));
        const updatedCart = await CartsModel.findOneAndUpdate(
            { _id: cid },
            { items: newItems },
            { new: true }
        );
        return res.status(200).json({
            status: "Success",
            msg: "Cart items updated",
            data: updatedCart,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid.trim();
      const quantity = req.body.quantity;
  
      if (!quantity || typeof quantity !== "number") {
        return res.status(400).json({
          status: "Error",
          msg: "Invalid 'quantity' value in the body",
        });
      }
  
      const cart = await CartsModel.findOne({ _id: cid });
      if (!cart) {
        return res.status(404).json({
          status: "Error",
          msg: "Cart " + cid + " not found",
        });
      }
  
      const productIndex = cart.items.findIndex(
        (item) => item.idProduct.toString() === pid
      );
  
      if (productIndex === -1) {
        return res.status(404).json({
          status: "Error",
          msg: "Product " + pid + " not found in cart",
        });
      }
  
      cart.items[productIndex].quantity = quantity;
      const updatedCart = await cart.save();
  
      return res.status(200).json({
        status: "Success",
        msg: "Product quantity updated in cart: " + cid,
        data: updatedCart,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "Something went wrong :(",
      });
    }
  });

  cartsRouter.delete("/:cid", async (req, res) => {
    try {
      const cid = req.params.cid;
  
      const cart = await CartsModel.findOne({ _id: cid });
      if (!cart) {
        return res.status(404).json({
          status: "Error",
          msg: "Cart " + cid + " not found",
        });
      }
  
      cart.items = [];
      const updatedCart = await cart.save();
  
      return res.status(200).json({
        status: "Success",
        msg: "Cart" + cid + " emptied",
        data: updatedCart,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "Something went wrong :(",
      });
    }
  });

