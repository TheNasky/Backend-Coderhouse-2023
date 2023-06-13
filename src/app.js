import express from "express";
import { messagesRouter } from "./routes/messages.router.js";
import { productsRouter } from "./routes/products.router.js";
// import { cartsRouter } from "./routes/carts.router.js";
import { viewsRouter } from "./routes/views.router.js";
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import { connectMongo } from "./utils.js";
import {Server} from "socket.io"
const app = express();
const PORT = 8080;
connectMongo()
const httpServer=app.listen(PORT, () => {console.log(`App listening on http://localhost:${PORT}`)})
const socketServer=new Server(httpServer)

//pasar a utils o socket
socketServer.on("connection", (socket) => {
    console.log("Nuevo Cliente conectado");  
});


app.engine("handlebars", handlebars.engine())
app.set("views",__dirname+"/views");
app.set("view engine","handlebars")

//--------------- Middlewares ---------------
app.use(express.static(__dirname+"/public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.socketServer = socketServer;
    next();
});


//--------------- Routes ---------------
app.use("/", viewsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/products", productsRouter);
// app.use("/api/carts", cartsRouter);

