import ProductsModel from "../DAO/models/products.model.js";
import ProductsServices from "../services/products.services.js";

const productsServices = new ProductsServices();

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
   } catch (e) {
      console.log(e);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const getProductById = async (req, res) => {
   const id = req.params.pid;
   try {
      const result = await productsServices.getProductById(id);
      res.status(result.status).json(result.result);
   } catch (e) {
      console.log(e);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const createProduct = async (req, res) => {
   const { title, description, code, price, status, stock, category } =
      req.body;
   const product = { title, description, code, price, status, stock, category };
   try {
      const result = await productsServices.createProduct(product);
      const socketServer = req.socketServer;
      res.status(result.status).json(result.result);
      if ((result.status = 200)) {
         socketServer.sockets.emit("refresh", "refresh");
      }
   } catch (e) {
      console.log(e);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
         data: {},
      });
   }
};

export const updateProduct = async (req, res) => {
   const { id } = req.params;
   const { title, description, code, price, status, stock, category } =
      req.body;
   const product = { title, description, code, price, status, stock, category };

   try {
      const result = await productsServices.updateProduct(id,product);
      const socketServer = req.socketServer;
      res.status(result.status).json(result.result);
      if ((result.status = 200)) {
         socketServer.sockets.emit("refresh", "refresh");
      }
   } catch (e) {
      console.log(e);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
         data: {},
      });
   }
};

export const deleteProduct = async (req, res) => {
   const { id } = req.params;
   try {
      const result = await productsServices.deleteProduct(id);
      const socketServer = req.socketServer;
      res.status(result.status).json(result.result);
      if ((result.status = 200)) {
         socketServer.sockets.emit("refresh", "refresh");
      }
   } catch (e) {
      console.log(e);
      return res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
         data: {},
      });
   }
};
