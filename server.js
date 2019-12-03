const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

//localhost port
const port = 4001

const app = express()

//server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

users = {}

io.on('connection', socket => {
  console.log('New client connected');
  Object.keys(users).forEach(function(item){

        socket.broadcast.emit('update-active', users[item]);
  })
  
  socket.on('new-user', (name) => {
      users[socket.id] = name;
      socket.broadcast.emit('user-connected', name);
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))