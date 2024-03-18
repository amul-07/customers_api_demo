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

//   restaurantRouter.get("/all", getRestaurants);

// restaurantRouter.get('/all/:storeId', findAllMenuHeaders);
// restaurantRouter.get('/items/:storeId', findAllFoodItems);
// restaurantRouter.get('/total/:storeId', getTotalMenuHeaderCount);
customerRouter.get("/search", findAll);
customerRouter.get("/:id", findCustomer);
customerRouter.get("/", findCustomerPerCity);
customerRouter.post("/", upload.none(), addCustomer);
// restaurantRouter.put('/:id', middleware.checkStoreOwner, updateMenuHeader);
// restaurantRouter.put('/status/:id', middleware.checkStoreOwner, updateMenuHeaderStatus);
// restaurantRouter.delete('/:id', middleware.checkStoreOwner, deleteMenuHeader);

export default customerRouter;
