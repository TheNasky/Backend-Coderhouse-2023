import MocksServices from "../services/mocks.services.js";
const mocksServices = new MocksServices();
import { logger } from "../utils/logger.js";

export const getMockedProducts = async (req, res) => {
   try {
      const result = await mocksServices.get100Products();
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`);
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};
