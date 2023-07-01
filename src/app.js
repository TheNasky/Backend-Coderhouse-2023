import express from "express";
import { messagesRouter } from "./routes/messages.router.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { authRouter } from "./routes/auth.router.js";
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import { connectMongo } from "./utils.js";
import {Server} from "socket.io"
import ProductsModel from "./DAO/models/products.model.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";


const app = express();
const PORT = 8080;
const httpServer=app.listen(PORT, () => {console.log(`App listening on http://localhost:${PORT}`)})
const socketServer=new Server(httpServer)
await connectMongo()


app.use(
  session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://thenasky:mBo2I5uMDxY6jsZy@e-commerce.bvacm9g.mongodb.net/?retryWrites=true&w=majority",
        ttl: 3600,
        dbName: "E-Commerce" }),
    secret: 'homeroChino',
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

  

//pasar a socket
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
app.use("/api/carts", cartsRouter);
app.use("/auth", authRouter);

