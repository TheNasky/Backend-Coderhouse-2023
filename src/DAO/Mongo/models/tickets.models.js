import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "mongoose";

const schema = new mongoose.Schema(
   {
      code: { type: String, required: true, unique: true },
      purchase_datetime: { type: Date, required: true },
      amount: { type: Number, default: Date.now(), required: true },
      purchaser: { type: String, required: true, default: "Anonymous:API" },
      products: [
         {
            product: { type: Mongoose.Types.ObjectId, ref: "products" },
            quantity: { type: Number, required: true, default: 0 },
            _id: false,
         },
      ],
   },
   {
      versionKey: false,
   }
);

schema.plugin(mongoosePaginate);
const TicketsModel = mongoose.model("tickets", schema);

export default TicketsModel;
