import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { NODE_ENV, PORT } from "./config/env.config.js";
import helmet from "helmet";

// routes
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// USE HTTPS IN PRODUCTION
app.set("trust proxy", 1);
app.use((req, res, next) => {
  if (NODE_ENV = "production" && !req.secure) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

app.listen(PORT, () => console.log(`1> Server running on ${PORT}`));
