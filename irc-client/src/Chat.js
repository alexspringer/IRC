import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      socket: socketIOClient("http://localhost:4001"),
      room: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const messageInput = document.getElementById("message-input");
    var message = messageInput.value;
    this.appendMessage(`You: ${message}`);
    messageInput.value = "";
    this.state.socket.emit("send-message", {
      room: this.state.room,
      message: message
    });
  }

  appendMessage(message) {
    const messageContainer = document.getElementById("message-container");
    const newMessage = document.createElement("div");
    newMessage.innerText = message;
    messageContainer.append(newMessage);
  }

  appendUser(user) {
    if (document.getElementById(user) != null) {
      return;
    }
    const userContainer = document.getElementById("user-container");
    const newUser = document.createElement("div");
    newUser.innerText = user;
    newUser.id = user;
    userContainer.append(newUser);
  }

  removeUser(user) {
    const userContainer = document.getElementById("user-container");
    const userToRemove = document.getElementById(user);
    if (!userToRemove) return;
    userContainer.removeChild(userToRemove);
  }

  newUser(room) {
    const name = prompt("Enter your name please:");
    this.setState({ name: name });
    this.appendMessage("You joined!");
    this.appendUser(name);
    this.state.socket.on("active-users", rooms => {
      var currentRooms = rooms[this.state.room].users;
      var singleRoom = Object.values(currentRooms);
      var activeUsers = Object.values(singleRoom);
      let i = 0;
      for (i = 0; i < activeUsers.length; i++) {
        this.appendUser(activeUsers[i]);
      }
    });

    this.state.socket.emit("new-user", { name: name, room: room });
  }

  componentDidMount() {
    var room = window.location.pathname;
    room = room.substr(1);
    this.setState({ room: room });

    document.getElementById("room").style.display = "none";

    this.newUser(room);

    this.state.socket.on("chat-message", data => {
      this.appendMessage(`${data.name}: ${data.message}`);
    });

    this.state.socket.on("user-connected", name => {
      this.appendMessage(`${name} connected.`);
      this.appendUser(name);
    });

    this.state.socket.on("user-disconnected", name => {
      this.appendMessage(`${name} disconnected.`);
      this.removeUser(name);
    });
  }
  render() {
    return (
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-3"></div>
          <div class="col-6 border">
            <div class="container break-word" id="message-container">
              <h6 class="text-center"> Message Container</h6>
            </div>
          </div>
          <div class="col-3 border">
            <div class="container" id="user-container">
              <h6 class="text-center">User Container</h6>
            </div>
          </div>
        </div>
        <div class="row justify-content-center fixed-bottom mb-5">
          <div class="col-6">
            <form onSubmit={this.handleSubmit}>
              <div class="input-group">
                <input
                  class="form-control"
                  type="text"
                  id="message-input"
                  name="message-input"
                  placeholder="Enter a message to chat."
                />
                <div class="input-group-append">
                  <button type="submit">Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Chat;
