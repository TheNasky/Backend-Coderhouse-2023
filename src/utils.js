
import {fileURLToPath} from "url"
import {dirname} from "path"

const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename)

export default __dirname


import { connect } from "mongoose";
import { ProductsModel } from "./DAO/models/products.model.js"
export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://TheNasky:9dEhBNvXTBEZuDTz@e-commerce.6tprp5i.mongodb.net/?retryWrites=true&w=majority",
      {
        dbName: "E-Commerce",
        
      }
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}


//-----------------Socket-----------------------



//

// const queryResult = await ProductsModel.paginate({},{})  

// const res = await ProductsModel.aggregate([
//   {
//     $project:{
//       else:"$$ROOT"
//     }
//   },
//   {
//     $out: "products"
//   },
// ])

