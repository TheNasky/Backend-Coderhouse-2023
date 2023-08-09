import mongoose from "mongoose"
import {fileURLToPath} from "url"
import {dirname} from "path"

const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename)

export default __dirname


import { connect } from "mongoose";
import ProductsModel from "./DAO/Mongo/models/products.model.js"
export async function connectMongo() {
  try {
    await connect(
      process.env.MONGO_LINK,
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


//-----------------Bcrypt-----------------------

import bcrypt from 'bcrypt';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);






