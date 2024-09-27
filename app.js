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

const users = [];

const saveUser = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);
  return user;
};

const getDisconnectUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUsersInRoom = (room) => {
  return users.filter((users) => (users.room = room));
};

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

    // Broadcast a message to all users except the one who just joined
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(BOT, `${user.username} joined the room`));

    // Listen message from client
    socket.on("message_send", (data) => {
      // Send back message to client
      io.to(user.room).emit("message", formatMessage(user.username, data));
    });

    // send room users
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
    }
  });
});
