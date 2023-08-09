import MessagesDao from "../DAO/Mongo/DAOS/messages.dao.js";

const messagesDao = new MessagesDao();

class MessagesServices {
   async getMessages() {
      try {
         const messages = await messagesDAO.getMessages();
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
            return {
               status: 400,
               result: {
                  status: "error",
                  msg: "Please type a message before sending",
                  payload: {},
               },
            };
         } else {
            const createdMessage = await messagesDao.createMessage({
               user,
               message,
            });
            return {
               status: 200,
               result: {
                  status: "Success",
                  msg: "Message sent",
                  payload: user + ": " + message,
               },
            };
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
