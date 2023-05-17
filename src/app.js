import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { viewsRouter } from "./routes/views.router.js";
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import {Server} from "socket.io"
import ProductManager from "./productManager.js";

const app = express();
const PORT = 8080;
const httpServer=app.listen(PORT, () => {console.log(`App listening on http://localhost:${PORT}`)})
const socketServer=new Server(httpServer)

app.engine("handlebars", handlebars.engine())
app.set("views",__dirname+"/views");
app.set("view engine","handlebars")

app.use(express.static(__dirname+"/public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req,res,next){
    req.socketServer = socketServer;
    next();
});

socketServer.on("connection",socket=>{
    console.log("Nuevo Cliente conectado")
})

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

