import { Router } from "express";
import __dirname from "../../__dirname.js";
import ProductsModel from "../DAO/Mongo/models/products.model.js";
import MessagesModel from "../DAO/Mongo/models/messages.model.js";
import { getAllProductsRender } from "../controllers/viewsController.js";
import { isCartOwner, isAdmin } from "../middlewares/auth.js";
import CartsServices from "../services/carts.services.js";

const cartsServices = new CartsServices();

export const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
   try {
      // Fetch the products
      const products = await ProductsModel.find({}).lean().exec();

      // Pass the session and products to the template
      res.status(200).render("index", {
         session: req.session,
         products: products,
      });
   } catch (error) {
      // Handle the error appropriately
      console.error(error);
      res.status(500).render("error", { error: "Internal Server Error" });
   }
});

viewsRouter.get("/carts/:cid", isCartOwner, async (req, res) => {
   try {
      const cid = req.params.cid;
      const cart = await cartsServices.getCartById(cid);
      const products = cart.result.payload.items.map((item) => item.toObject());
      res.render("cart", { products: products, session: req.session });
   } catch (error) {
      console.log(error);
   }
});

viewsRouter.get("/product/:pid", async (req, res) => {
   try {
      const productId = req.params.pid;
      const product = await ProductsModel.findById(productId).lean().exec();
      if (!product) {
         return res.status(404).render("error", { message: "Product not found" });
      }
      res.render("product", { product: product, session: req.session });
   } catch (error) {
      console.log(error);
      res.status(500).render("error", { message: "Internal Server Error" });
   }
});

viewsRouter.get("/create-product", isAdmin,async (req, res) => {
   const products = await ProductsModel.find({}).lean().exec();
   const list = {
      products: products,
      session:req.session
   };
   res.status(200).render("createProduct", list);
});


viewsRouter.get("/realTimeProducts", async (req, res) => {
   const products = await ProductsModel.find({}).lean().exec();
   const list = {
      products: products,
      style: "home.css",
   };
   res.status(200).render("realTimeProducts", list);
});

viewsRouter.get("/chat", async (req, res) => {
   const messages = await MessagesModel.find({}).sort({ _id: -1 }).limit(25).lean().exec();
   const reversedMessages = messages.reverse();
   const list = {
      messages: reversedMessages,
      style: "chat.css",
   };
   res.status(200).render("chat", list);
});

viewsRouter.get("/products", getAllProductsRender);
