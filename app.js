import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import formatMessage from "./utils/formatMessage.js";

const app = express();
app.use(cors());

const server = app.listen(8080, () => {
  console.log("Server is running");
});

const io = new Server(server, {
  cors: "*",
});

// Run when client-server connected
io.on("connection", (socket) => {
  console.log("client connected");
  const BOT = "Bot";

  // Send welcome message to all users
  socket.emit("message", formatMessage(BOT, "Welcome to the room"));

  // Broadcast a message to all users except the one who just joined
  socket.broadcast.emit("message", formatMessage(BOT, "User joined"));

  socket.on("disconnect", () => {
    io.emit("message", formatMessage(BOT, "User left the room"));
  });
});
