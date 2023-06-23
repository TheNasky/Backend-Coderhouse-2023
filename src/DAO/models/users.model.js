import mongoosePaginate from "mongoose-paginate-v2"
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username: { type: String, required: true, max: 50, unique:true},
    email: { type: String, required: true, max: 150,unique:true },
    password: { type: String, required: true, max: 50 },
    isAdmin: { type: Boolean, required: true },
    // roles: { type: Boolena, required: true },

},{
    versionKey: false
});

schema.plugin(mongoosePaginate);
const UsersModel = mongoose.model("users", schema);

export default UsersModel;