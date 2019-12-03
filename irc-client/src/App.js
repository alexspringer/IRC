import React, { Component } from "react";
import socketIOClient from "socket.io-client";
class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://127.0.0.1:4001",
    };
  }

  appendMessage(message){
    const messageContainer = document.getElementById("message-container");
    const newMessage = document.createElement('div');
    newMessage.innerText = message;
    messageContainer.append(newMessage);
  }

  newUser(socket){
    const name = prompt("Enter your name please:");
    this.appendMessage("You joined!")
    socket.emit('new-user', name);
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    this.newUser(socket);
    socket.on('user-connected', name =>{
      this.appendMessage(`${name} connected.`);
    });
    socket.on('user-disconnected', name =>{
      this.appendMessage(`${name} disconnected.`);
    });
  }
  render() {
    return (
      <div>
        <div id="message-container"></div>
      </div>
    );
  }
}
export default App;