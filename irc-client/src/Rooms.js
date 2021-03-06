import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Chat from "./Chat";

class Rooms extends Component {
  constructor() {
    super();
    this.state = {
      socket: socketIOClient("http://localhost:4001")
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const roomInput = document.getElementById("room-input");
    var room = roomInput.value;
    if (!document.getElementById(room)) {
      this.appendRoom(room);
      this.state.socket.emit("send-room", room);
    }
    roomInput.value = "";
  }

  appendRoom(room) {
    const roomContainer = document.getElementById("room-container");
    const newRoom = document.createElement("div");
    const roomLink = document.createElement("a");

    newRoom.innerText = room;
    newRoom.id = room;

    roomLink.href = `/${room}`;
    roomLink.append(newRoom);

    roomContainer.append(roomLink);
  }

  componentDidMount() {
    this.state.socket.on("new-room", room => {
      this.appendRoom(room);
    });

    this.state.socket.on("active-rooms", roomNameList => {
      let i = 0;
      for (i = 0; i < roomNameList.length; i++) {
        this.appendRoom(roomNameList[i]);
      }
    });
  }

  render() {
    return (
      <Router>
        <div id="room" class="container">
          <div id="room-container" class="container"></div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              class="form-control"
              id="room-input"
              name="room-input"
            />
            <div class="input-group-append">
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
        <Switch>
          <Route path="/:room">
            <Chat />
          </Route>
        </Switch>
      </Router>
    );
  }
}
export default Rooms;
