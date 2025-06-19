import express from "express";
import {
  createOrderController,
  deleteOrderByFieldController,
  getAllOrderController,
  getOrderByFieldController,
  updateOrderByIdController,
} from "../controllers/order.controller.js";

const router = express.Router();

router.route("/").post(createOrderController).get(getAllOrderController);

router
  .route("/fields")
  .get(getOrderByFieldController)
  .delete(deleteOrderByFieldController);

router
 .route("/:id")
 .put(updateOrderByIdController);

export default router;
