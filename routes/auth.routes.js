import express from "express";
import {
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/login").post(loginController);
router.route("/logout").post(logoutController);

export default router;
