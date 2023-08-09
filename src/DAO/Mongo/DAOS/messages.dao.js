import MessagesModel from "../models/messages.model.js";

export default class MessagesDao {
   getMessages = async () => {
      try {
         let messages = await MessagesModel.find();
         return messages;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   getMessageById = async (id) => {
      try {
         let message = await MessagesModel.findOne({ _id: id });
         return message;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   createMessage = async (message) => {
      try {
         let createdMessage = await MessagesModel.create(message);
         return createdMessage
      } catch (error) {
         console.log(error);
         return null;
      }
   };
   updateMessage = async (id, message) => {
      try {
         let result = await MessagesModel.updateOne(
            { _id: id },
            { $set: message }
         );
      } catch (error) {
         console.log(error);
         return null;
      }
   };
}
