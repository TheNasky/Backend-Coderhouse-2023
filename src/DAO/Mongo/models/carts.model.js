import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "mongoose";

const schema = new mongoose.Schema(
   {
      items: [
         {
            product: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "products",
               required: true,
            },
            quantity: {
               type: Number,
               required: true,
               min: 1,
            },
            _id: false,
         },
      ],
      createdAt: {
         type: Date,
         default: Date.now,
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "users",
      },
   },
   {
      versionKey: false,
   }
);

schema.plugin(mongoosePaginate);
const CartsModel = mongoose.model("carts", schema);

export default CartsModel;
