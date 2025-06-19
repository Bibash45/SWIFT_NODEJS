import express from "express";
import {
  createProductController,
  updateProductByFieldController,
  getAllProductsController,
  getProductByFieldController,
  deleteProductByFieldController,
} from "../controllers/product.controller.js";
import protect from "./../middlewares/authMiddleware.js";
import roleCheck from "./../middlewares/roleMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, roleCheck(["admin"]), createProductController)
  .get(getAllProductsController)
  .put(updateProductByFieldController)
  .delete(deleteProductByFieldController);

// Dynamic get by query: ?field=id&value=2
router.get("/search", getProductByFieldController);

export default router;
