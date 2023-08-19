import { ExpressHandlebars } from "express-handlebars";
import CartsServices from "../services/carts.services.js";
import { logger } from "../utils/logger.js";


const cartsServices = new CartsServices();

export const getAllCarts = async (req, res) => {
   try {
      const result = await cartsServices.getAllCarts();
      Expre.logas
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`)
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const getCartById = async (req, res) => {
   try {
      const cid = req.params.cid;
      const result = await cartsServices.getCartById(cid);
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`)
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const createCart = async (req, res) => {
   try {
      const result = await cartsServices.createCart();
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`)
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const addProductToCart = async (req, res) => {
   try {
      const cid = req.params.cid;
      const pid = req.params.pid.trim();
      const result = await cartsServices.addProductToCart(cid, pid);
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`)
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const deleteProductFromCart = async (req, res) => {
   try {
      const cid = req.params.cid;
      const pid = req.params.pid.trim();
      const result = await cartsServices.deleteProductFromCart(cid, pid);
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`)
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const updateCartWithProducts = async (req, res) => {
   try {
      const cid = req.params.cid.trim();
      const products = req.body;
      const result = await cartsServices.updateCartWithProducts(cid, products);
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`)
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const updateProductQuantityInCart = async (req, res) => {
   try {
      const cid = req.params.cid;
      const pid = req.params.pid.trim();
      const quantity = req.body.quantity;
      const result = await cartsServices.updateProductQuantityInCart(cid, pid, quantity);
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`)
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const emptyCart = async (req, res) => {
   try {
      const cid = req.params.cid;
      const result = await cartsServices.emptyCart(cid);
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`)
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const purchaseCart = async (req, res) => {
   const cid = req.params.cid;
   const result = await cartsServices.purchaseCart(cid);
   return res.status(result.status).json(result.result);
};

export const getTickets = async (req, res) => {
   const result = await cartsServices.getTickets();
   return res.status(result.status).json(result.result);
};
