import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { messagesRouter } from "./routes/messages.router.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { authRouter } from "./routes/auth.router.js";
import { mocksRouter } from "./routes/mocks.router.js";

import handlebars from "express-handlebars";
import __dirname from "./utils/utils.js";
import { connectMongo } from "./utils/utils.js";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import compression from "compression";
import errorHandler from "./middlewares/errors.js";
import { addLogger } from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
   console.log(`App listening on http://localhost:${PORT}`);
});
const socketServer = new Server(httpServer);
await connectMongo();

app.use(
   session({
      store: MongoStore.create({
         mongoUrl: process.env.MONGO_LINK,
         ttl: 3600,
         dbName: "E-Commerce",
      }),
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
   })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//pasar a socket
socketServer.on("connection", (socket) => {
   console.log("Nuevo Cliente conectado");
});

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//--------------- Middlewares ---------------
app.use(addLogger);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(compression({}));
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
app.use("/api/sessions", sessionsRouter);
app.use("/api/mock", mocksRouter);

// borrar esto x dios
app.use("/loggerTest", (req, res) => {
   req.logger.debug("Mensage de debug");
   req.logger.http("Mensage de http");
   req.logger.info("Mensage de info");
   req.logger.warn("Mensage de warn");
   req.logger.error("Mensage de error");
   req.logger.fatal("Mensage de fatal");
   res.status(200).send("Mirá la consola pa")
});

//errorHandler
app.use(errorHandler);
