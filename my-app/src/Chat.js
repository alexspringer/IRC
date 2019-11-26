import React from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardFooter,
  Input,
  InputGroup,
  Button
} from "reactstrap";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      message: "",
      messages: []
    };

    this.socket = io("localhost:8080");

    this.socket.on("RECEIVE_MESSAGE", function(data) {
      addMessage(data);
    });

    const addMessage = data => {
      console.log(data);
      this.setState({ messages: [...this.state.messages, data] });
      console.log(this.state.messages);
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit("SEND_MESSAGE", {
        author: this.state.username,
        message: this.state.message
      });
      this.setState({ message: "" });
    }


  }
  render() {
    return (
      <Container>
            <Card>
              <CardBody>
                <CardTitle className="text-center">Chat</CardTitle>
                <div className="messages">
                  {this.state.messages.map(message => {
                    return <div>{message.author}: {message.message}</div>;
                  })}
                </div>
              </CardBody>
              <CardFooter>
                <Input
                  value={this.state.username}
                  onChange={ev => this.setState({ username: ev.target.value })}
                  type="text"
                  placeholder="Username"
                />
                <br></br>
                <Input
                  value={this.state.message}
                  onChange={ev => this.setState({ message: ev.target.value })}
                  type="text"
                  placeholder="Message"
                />
                <br></br>
                <Button onClick={this.sendMessage} color="primary">
                  Send
                </Button>
              </CardFooter>
            </Card>
      </Container>
    );
  }
}
export default Chat;
