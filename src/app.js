import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { messagesRouter } from "./routes/messages.router.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { authRouter } from "./routes/auth.router.js";
import { mocksRouter } from "./routes/mocks.router.js";
import { sessionsRouter } from "./routes/sessions.router.js";

import handlebars from "express-handlebars";
import __dirname from "../__dirname.js";
import { connectMongo } from "./utils/utils.js";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import compression from "compression";
import errorHandler from "./middlewares/errors.js";
import { addLogger } from "./utils/logger.js";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


const app = express();
const PORT = process.env.PORT || 8080;

// Create HTTP server
const httpServer = app.listen(PORT, () => {
   console.log(`App listening on http://localhost:${PORT}`);
});

// Create Socket.io server
const socketServer = new Server(httpServer);

// Connect to MongoDB
await connectMongo();

// Set up session middleware
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

const swaggerOptions = {
   definition: {
      openapi: "3.0.1",
      info: {
         title: "Documentación del poder y el saber",
         description: "Api Pensada para clase de Swagger",
      },
   },
   apis: [`src/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/apidocs",swaggerUiExpress.serve,swaggerUiExpress.setup(specs))

// Initialize Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Handle socket connections
socketServer.on("connection", (socket) => {
   console.log("New client connected");
});

// Configure Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");

// Middleware section
app.use(addLogger); // Custom logger middleware
app.use(express.static(__dirname + "/src/public")); // Serve static files
app.use(express.json()); // Parse JSON requests
app.use(compression({})); // Enable response compression
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Make the socket server accessible in requests
app.use((req, res, next) => {
   req.socketServer = socketServer;
   next();
});

// Define routes
app.use("/", viewsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/auth", authRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mock", mocksRouter);

// Error handling middleware
app.use(errorHandler);
