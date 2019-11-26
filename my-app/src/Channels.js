import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, ListGroup, ListGroupItem, Card } from "reactstrap";
class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: "",
      channels: ["Global", "Furry", "Anime"]
    };
  }

  handleDelete(channelToDelete) {
    var newChannel = this.state.channels.filter(_channel => {
      return _channel != channelToDelete;
    });
    this.setState({ channels: newChannel });
  }

  render() {
    return (
      <Card>
        <Container>
          <Button outline block size="sm">
            Join Channel
          </Button>
          <br />
          <ListGroup>
            {this.state.channels.map(channel => {
              return (
                <Container>
                  <ListGroupItem id={channel}>#{channel}</ListGroupItem>
                  <Button
                    onClick={this.handleDelete.bind(this, channel)}
                    size="sm"
                    className="justify-content-right"
                  >
                    X
                  </Button>
                </Container>
              );
            })}
          </ListGroup>
        </Container>
      </Card>
    );
  }
}
export default Channel;
