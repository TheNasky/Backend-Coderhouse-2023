import { Schema, model } from "mongoose";

const schema = new Schema({
    user: { type: String, required: true, max: 50 },
    message: { type: String, required: true, max: 350 },
},
{
    versionKey: false
});

const MessagesModel = model("Messages", schema);

export default MessagesModel