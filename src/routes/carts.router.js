import express from 'express';
import {
	getAllCarts,
	getCartById,
	createCart,
	addProductToCart,
	deleteProdductFromCart,
	updateCartWithProducts,
	UpdateProductQuantityInCart,
	emptyCart
} from '../controllers/cartController.js';

export const cartsRouter = express.Router();

// Get all carts
cartsRouter.get('/', getAllCarts);

// Get a specific cart by ID
cartsRouter.get('/:cid', getCartById);

// Create a new cart
cartsRouter.post('/', createCart);

// Add a product to a cart
cartsRouter.post('/:cid/products/:pid', addProductToCart);

// Delete a product from a cart
cartsRouter.delete('/:cid/products/:pid', deleteProdductFromCart);

// Update a cart with new products
cartsRouter.put('/:cid', updateCartWithProducts);

// Update the quantity of a product in a cart
cartsRouter.put('/:cid/products/:pid', UpdateProductQuantityInCart);

// Empty a cart
cartsRouter.delete('/:cid', emptyCart);
