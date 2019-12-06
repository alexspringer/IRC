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

users = {};
rooms = {};

io.on("connection", socket => {
  console.log("New client connected");
  socket.emit("active-users", rooms);

  var roomNameList = Object.keys(rooms);
  socket.emit("active-rooms", roomNameList);

  socket.on("new-user", data => {
    socket.join(data.room);
    rooms[data.room].users[socket.id] = data.name;
    socket.to(data.room).broadcast.emit("user-connected", data.name);
  });

  socket.on("send-message", data => {
    socket
      .to(data.room)
      .broadcast.emit("chat-message", {
        name: rooms[data.room].users[socket.id],
        message: data.message
      });
  });

  socket.on("send-room", room => {
    rooms[room] = { users: {} };
    socket.broadcast.emit("new-room", room);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    getRooms(socket).forEach(room => {
      socket
        .to(room)
        .broadcast.emit("user-disconnected", rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});

function getRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}

server.listen(port, () => console.log(`Listening on port ${port}`));
