import MessagesServices from "../services/messages.services.js";

const messagesServices = new MessagesServices();

export const getMessages = async (req, res) => {
   try {
      const messages = await messagesServices.getMessages();
      res.status(result.status).json(result.result);
   } catch (error) {
      console.log(error);
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const postMessages = async (req, res) => {
   const { user, message } = req.body;
   try {
      const result = await messagesServices.createMessage(user,message);
      const socketServer = req.socketServer;
      res.status(result.status).json(result.result);
      if(result.status=200){
         socketServer.sockets.emit("refresh", "refresh");
      }
   } catch (error) {
      console.log(error);
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};
