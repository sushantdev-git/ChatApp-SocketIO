const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data.room);
    console.log(`User with ID: ${data.name}:${socket.id} joined room: ${data.room}`);
    socket.emit("receive_message",{message:"Welcome to Chat"})
    socket.to(data.room).emit("receive_message", {message:`${data.name} joined the chat!!`});
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
