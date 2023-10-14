import ProductsServices from "../services/products.services.js";
import { logger } from "../utils/logger.js";

const productsServices = new ProductsServices();

// Get all products with optional query parameters
export const getAllProducts = async (req, res) => {
   const limit = req.query.limit;
   const page = req.query.page;
   const sort = req.query.sort;
   const category = req.query.category;
   const inStock = req.query.inStock;
   try {
      const result = await productsServices.getAllProducts(
         limit,
         page,
         sort,
         category,
         inStock
      );
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

// Get a product by its ID
export const getProductById = async (req, res) => {
   const id = req.params.pid;
   try {
      const result = await productsServices.getProductById(id);
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

// Create a new product
export const createProduct = async (req, res) => {
   const { title, description, code, price, status, stock, category } = req.body;
   const product = { title, description, code, price, status, stock, category };
   try {
      const result = await productsServices.createProduct(product);
      const socketServer = req.socketServer;
      res.status(result.status).json(result.result);
      if (result.status === 200) {
         socketServer.sockets.emit("refresh", "refresh");
      }
   } catch (error) {
      logger.error(`${error.stack}`);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
         data: {},
      });
   }
};

// Update a product by its ID
export const updateProduct = async (req, res) => {
   const { id } = req.params;
   const { title, description, code, price, status, stock, category } = req.body;
   const product = { title, description, code, price, status, stock, category };

   try {
      const result = await productsServices.updateProduct(id, product);
      const socketServer = req.socketServer;
      res.status(result.status).json(result.result);
      if (result.status === 200) {
         socketServer.sockets.emit("refresh", "refresh");
      }
   } catch (error) {
      logger.error(`${error.stack}`);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
         data: {},
      });
   }
};

// Delete a product by its ID
export const deleteProduct = async (req, res) => {
   const { id } = req.params;
   try {
      const result = await productsServices.deleteProduct(id);
      const socketServer = req.socketServer;
      res.status(result.status).json(result.result);
      if (result.status === 200) {
         socketServer.sockets.emit("refresh", "refresh");
      }
   } catch (error) {
      logger.error(`${error.stack}`);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
         data: {},
      });
   }
};
