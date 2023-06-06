import { Schema, model } from "mongoose";

const schema = new Schema({
    title: { type: String, required: true, max: 50 },
    description: { type: String, required: true, max: 150 },
    code: { type: String, required: true, max: 50 },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true,required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, max: 50 },
    thumbnail: { type: String, required: false, max: 100 },
});

export const ProductsModel = model("Products", schema,"Products");
