import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      socket: socketIOClient("http://localhost:4001"),
      room: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewRoom = this.handleNewRoom.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const messageInput = document.getElementById("message-input");
    var message = messageInput.value;
    this.appendMessage(`You: ${message}`);
    messageInput.value = "";
    this.state.socket.emit("send-message", {room:this.state.room, message:message});
  }

  appendMessage(message) {
    const messageContainer = document.getElementById("message-container");
    const newMessage = document.createElement("div");
    newMessage.innerText = message;
    messageContainer.append(newMessage);
  }

  //Appends a user to the list of active users.
  appendUser(user) {
    if (document.getElementById(user) != null) {
      return; //This user is already an active user.
    }
    const userContainer = document.getElementById("user-container");
    const newUser = document.createElement("div");
    newUser.innerText = user;
    newUser.id = user; //set the id to the user so we can easily remove when the user dc
    userContainer.append(newUser);
  }

  appendRoom(roomName) {
    if(document.getElementById(roomName)) return;
    const roomContainer = document.getElementById("room-container");
    const newRoom = document.createElement("div");
    const roomLink = document.createElement("a");
    const roomRemove = document.createElement("button");
    
    roomRemove.innerText="X";
    roomRemove.id=roomName;
    //roomRemove.onclick=removeRoom(roomRemove.id);

    newRoom.innerText = roomName;
    newRoom.id = roomName;

    roomLink.href=`/${roomName}`
    roomLink.append(newRoom);

    roomContainer.append(roomLink);
    roomContainer.append(roomRemove);
  }

  //When a user disconnect, we emit the user who disconencted to the client.
  //We use that information to remove the user from the list of active users.
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
    this.state.socket.on("active-users", userList => {
      console.log(userList);
      if (userList) {
        let i = 0;
        for (i = 0; i < userList.length; i++) {
          this.appendUser(userList[i]);
        }
      }
    });

    this.state.socket.emit("new-user", {name: name, room: room});
  }

  handleNewRoom(event) {
    event.preventDefault();
    var roomInput = document.getElementById("room-input");
    var roomName = roomInput.value;
    this.appendRoom(roomName);
    roomInput.value = "";
    this.state.socket.emit("send-room", roomName);
  }

  componentDidMount() {
    var room = window.location.pathname;
    room = room.substr(1);
    this.setState({room: room});

    document.getElementById("room").style.display = "none"

    this.newUser(room);

    this.state.socket.on("chat-message", data => {
      this.appendMessage(`${data.name}: ${data.message}`);
    });

    this.state.socket.on("new-room", room =>{
      this.appendRoom(room);
    })

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
          <div class="col-3">
            <h6>Room Container</h6>
            <div id="room-container"></div>
            <form onSubmit={this.handleNewRoom}>
              <div class="input-group">
                <input
                  class="form-control"
                  type="text"
                  id="room-input"
                  name="room-input"
                />
                <div class="input-group-append">
                  <button type="submit">Create</button>
                </div>
              </div>
            </form>
          </div>
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