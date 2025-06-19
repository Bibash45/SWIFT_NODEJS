import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired. Please log in again." });
    }
    res.status(401).json({ error: "Access denied." });
  }
};

export default protect;
