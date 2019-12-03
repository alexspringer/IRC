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

  //Appends a user to the list of active users.
  appendUser(user){
    if(document.getElementById(user) != null){
      return; //This user is already an active user.
    }
    const userContainer = document.getElementById("user-container");
    const newUser = document.createElement('div');
    newUser.innerText = user;
    newUser.id = user; //set the id to the user so we can easily remove when the user dc
    userContainer.append(newUser);
  }

  //When a user disconnect, we emit the user who disconencted to the client.
  //We use that information to remove the user from the list of active users.
  removeUser(user){
    const userContainer = document.getElementById("user-container");
    const userToRemove = document.getElementById(user);
    const throwAway = userContainer.removeChild(userToRemove);
  }

  newUser(socket){
    const name = prompt("Enter your name please:");
    this.appendMessage("You joined!");
    this.appendUser(name);
    socket.emit('new-user', name);
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    this.newUser(socket);

    socket.on('user-connected', name =>{
      this.appendMessage(`${name} connected.`);
    });

    socket.on('update-active', user => {
      console.log(user);
      this.appendUser(user);
    })
    socket.on('user-disconnected', name =>{
      this.appendMessage(`${name} disconnected.`);
      this.removeUser(name);
    });
  }
  render() {
    return (
      <div>
        <div id="message-container"></div>
        <div id="user-container"></div>
      </div>
    );
  }
}
export default App;