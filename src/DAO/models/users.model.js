import mongoosePaginate from "mongoose-paginate-v2"
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    firstName: { type: String, required: true, max: 150,},
    lastName: { type: String, required: true, max: 150,},
    email: { type: String, required: true, max: 150,unique:true },
    password: { type: String, required: true, max: 50 },
    isAdmin: { type: Boolean, required: true, default:false },
    roles: { type: [String], required: true, default:["     User",] },
        

},{
    versionKey: false
});

schema.plugin(mongoosePaginate);
const UsersModel = mongoose.model("users", schema);

export default UsersModel;