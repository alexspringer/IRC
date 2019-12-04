import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      socket: socketIOClient("http://localhost:4001")
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const messageInput = document.getElementById("message-input");
    var message = messageInput.value;
    this.appendMessage(`You: ${message}`);
    messageInput.value = "";
    this.state.socket.emit("send-message", message);
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

  //When a user disconnect, we emit the user who disconencted to the client.
  //We use that information to remove the user from the list of active users.
  removeUser(user) {
    const userContainer = document.getElementById("user-container");
    const userToRemove = document.getElementById(user);
    if (!userToRemove) return;
    userContainer.removeChild(userToRemove);
  }

  newUser(socket) {
    const name = prompt("Enter your name please:");
    this.setState({ name: name });
    this.appendMessage("You joined!");
    this.appendUser(name);
    socket.on("active-users", userList => {
      console.log(userList);
      if (userList) {
        let i = 0;
        for (i = 0; i < userList.length; i++) {
          this.appendUser(userList[i]);
        }
      }
    });

    socket.emit("new-user", name);
  }

  componentDidMount() {
    //const { endpoint } = this.state;
    //const socket = socketIOClient(endpoint);
    this.newUser(this.state.socket);

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
          <div class="col-6">
            <div class="container break-word" id="message-container">
              <h6 class="text-center"> Message Container</h6>
            </div>
          </div>
          <div class="col-3">
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
export default App;
