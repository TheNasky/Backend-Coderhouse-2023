import { Router } from "express";
import { getMockedProducts } from "../controllers/mocks.controller.js";
export const mocksRouter = Router();

mocksRouter.get('/mockingproducts', getMockedProducts);

