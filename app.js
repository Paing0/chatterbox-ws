import cors from "cors";
import express from "express";
import { Server } from "socket.io";

import formatMessage from "./utils/formatMessage.js";
import { getDisconnectUser, getUsersInRoom, saveUser } from "./utils/user.js";

import mongoose from "mongoose";
import "dotenv/config";

import Message from "./models/Message.js";
import messageRoute from "./routes/message.js";

const app = express();
app.use(cors());
app.use(messageRoute);

await mongoose.connect(process.env.MONGO_URL);
console.log("Connected to database");

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

  socket.on("joined_room", (data) => {
    const { username, room } = data;

    // Fired when user joined the room
    const user = saveUser(socket.id, username, room);
    socket.join(user.room);

    // Send welcome message to all users
    socket.emit("message", formatMessage(BOT, "Welcome to the room"));

    // Broadcast a message to all users that a new user joined except, the one who just joined
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(BOT, `${user.username} joined the room`));

    // Listen message from client
    socket.on("message_send", (data) => {
      // Send back message to client
      io.to(user.room).emit("message", formatMessage(user.username, data));

      // store message in db
      Message.create({
        username: user.username,
        message: data,
        room: user.room,
      });
    });

    // send room users on joined room
    io.to(user.room).emit("room_users", getUsersInRoom(user.room));
  });

  // Send disconnect message to all useres
  socket.on("disconnect", () => {
    const user = getDisconnectUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(BOT, `${user.username} left the room`),
      );

      // update room users when disconnect
      io.to(user.room).emit("room_users", getUsersInRoom(user.room));
    }
  });
});
