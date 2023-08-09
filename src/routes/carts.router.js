import express from "express";
import {
   getAllCarts,
   getCartById,
   createCart,
   addProductToCart,
   deleteProductFromCart,
   updateCartWithProducts,
   updateProductQuantityInCart,
   emptyCart,
} from "../controllers/carts.controller.js";
import { isAdmin, isCartOwner } from "../middlewares/auth.js";

export const cartsRouter = express.Router();

// Get all carts
cartsRouter.get("/", getAllCarts);

// Get a specific cart by ID
cartsRouter.get("/:cid", getCartById);

// Create a new cart
cartsRouter.post("/", createCart);

// Add a product to a cart
cartsRouter.post("/:cid/products/:pid", isCartOwner, addProductToCart);

// Delete a product from a cart
cartsRouter.delete("/:cid/products/:pid", isCartOwner, deleteProductFromCart);

// Update a cart with new products
cartsRouter.put("/:cid", isCartOwner, updateCartWithProducts);

// Update the quantity of a product in a cart
cartsRouter.put(
   "/:cid/products/:pid",
   isCartOwner,
   updateProductQuantityInCart
);

// Empty a cart
cartsRouter.delete("/:cid", isCartOwner, emptyCart);

// Purchase a cart
cartRoutes.post('/purchase/:cid', isUser,isCartOwner, purchaseCart);

// get all tickets
cartRoutes.get('/tickets', isUser,isAdmin, getTickets);