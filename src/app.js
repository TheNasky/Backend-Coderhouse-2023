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
app.get('/login', (req, res) => {
  const { username, password } = req.query;
  if (username !== 'pepe' || password !== 'pepepass') {
    return res.send('login failed');
  }
  req.session.user = username;
  req.session.admin = true;
  res.send('login success!');
});

app.get('/session', (req, res) => {
    if (req.session.cont) {
      req.session.cont++;
      res.send('nos visitaste ' + req.session.cont);
    } else {
      req.session.cont = 1;
      res.send('nos visitaste ' + 1);
    }
  });
app.get('/show-session', (req, res) => {
  return res.send(JSON.stringify(req.session));
}); 


app.get('/logout', (req, res) => {
 req.session.destroy(err => {
   if (err) {
     return res.json({ status: 'Logout ERROR', body: err })
   }
   res.send('Logout ok!')
 })
})

    
  

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
app.use("/api/carts", cartsRouter);
app.use("/auth", authRouter);

