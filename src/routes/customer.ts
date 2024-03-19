// import { middleware } from '../../middleware/middleware';
// import {
//     getRestaurants,
//     //     deleteMenuHeader,
//     //     findAllFoodItems,
//     //     findAllMenuHeaders,
//     //     findMenuHeader,
//     //     getTotalMenuHeaderCount,
//     //     updateMenuHeader,
//     //     updateMenuHeaderStatus
//   } from "../../controllers/restaurant/restaurant";

import { Router } from "express";
import {
  addCustomer,
  findAll,
  findCustomer,
  findCustomerPerCity,
} from "../controllers/customer";
import { upload } from "../utils/upload";

const customerRouter = Router();

customerRouter.get("/search", findAll);
customerRouter.get("/:id", findCustomer);
customerRouter.get("/", findCustomerPerCity);
customerRouter.post("/", upload.none(), addCustomer);

export default customerRouter;
