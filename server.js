// server.js
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import setupSocket from "./services/socket.service.js";
import { PORT } from "./config/env.config.js";

dotenv.config();

const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
setupSocket(io);


server.listen(PORT, () => {
  console.log(`1> Server running on http://localhost:${PORT}`);
});
