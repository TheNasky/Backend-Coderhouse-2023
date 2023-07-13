import mongoosePaginate from "mongoose-paginate-v2"
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    
    firstName: { type: String, required: true, max: 150,},
    lastName: { type: String, required: true, max: 150,},
    email: { type: String, required: true, max: 150,unique:true },
    age:{type:Number,required:true,},
    password: { type: String, required: true, max: 50 },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts",},
    roles: { type: [String], required: true, default:["User",] },
        

},{
    versionKey: false
});

schema.plugin(mongoosePaginate);
const UsersModel = mongoose.model("users", schema);

export default UsersModel;