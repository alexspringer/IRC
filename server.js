const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

//localhost port
const port = 4001;

const app = express();

//server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

//users = {};
rooms = {}

io.on("connection", socket => {
  console.log("New client connected");
  var userList = Object.values(users);
  socket.emit("active-users", userList);

  socket.on("new-user", data => {
    socket.join(data.room);
    rooms[data.room].users[socket.id] = data.name;
    console.log(rooms);
    socket.to(data.room).broadcast.emit("user-connected", data.name);
  });

  socket.on("send-message", message =>{
    socket.broadcast.emit("chat-message", {name: users[socket.id], message: message});
  })

  socket.on("send-room", room =>{
    rooms[socket.id] = room;
    socket.broadcast.emit("new-room", room);
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
