import MocksServices from "../services/mocks.services.js";
const mocksServices = new MocksServices();

export const getMockedProducts = async (req, res) => {
   try {
     const result = await mocksServices.get100Products();
     res.status(result.status).json(result.result);
   } catch (error) {
     console.error(error);
     res.status(500).json({
       status: 'error',
       msg: 'Something went wrong :(',
     });
   }
};
