import MessagesModel from "../DAO/models/messages.model.js";

class MessagesServices {
   async getMessages() {
      try {
         const messages = await MessagesModel.find({});
         return res.status(200).json({
            status: "Success",
            msg: "Message List",
            payload: messages,
         });
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }
   async createMessage(user, message) {
      try {
         if (!message) {
            return{
               status:400,
               result:{
                  status: "error",
                  msg: "Please type a message before sending",
                  payload: {},
            }};
         } else {
            const createdMessage = await MessagesModel.create({
               user,
               message,
            });
            return{
               status:200,
               result:{
                  status: "Success",
                  msg: "Message sent",
                  payload: user + ": " + message,
            }};
         }
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }
}


export default MessagesServices;