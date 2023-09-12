import mongoose from "mongoose"

import { connect } from "mongoose";
import ProductsModel from "../DAO/Mongo/models/products.model.js"
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

import bcrypt from 'bcryptjs';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);






