import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

export const productsRouter = express.Router();

// Get all products
productsRouter.get('/', getAllProducts);

// Get a specific product by ID
productsRouter.get('/:pid', getProductById);

// Create a new product
productsRouter.post('/', createProduct);

// Update a product
productsRouter.put('/:id', updateProduct);

// Delete a product
productsRouter.delete('/:id', deleteProduct);
