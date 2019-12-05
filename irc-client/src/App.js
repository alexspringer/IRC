import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import Rooms from "./Rooms"

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return <Rooms/>;
  }
}
export default App;
