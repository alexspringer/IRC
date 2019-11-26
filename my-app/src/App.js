import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "reactstrap";
import Chat from "./Chat";
import Channels from "./Channels"

function App() {
  return (
    <div className="App">
      <Row>
        <Col sm="3">
          <Channels/>
        </Col>
        <Col sm="6">
          <Chat />
        </Col>
        <Col sm="3">
          {/*<Users/>*/}

        </Col>
      </Row>
    </div>
  );
}

export default App;
