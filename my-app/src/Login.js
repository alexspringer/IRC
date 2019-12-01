import React from "react";
import "bootstrap/dist/css/bootstrap.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form action="/chat">
        <div class="form-group">
          <label for="usernameInput">Enter Username</label>
          <input type="text" class="form-control" id="usernameInput"></input>
          <br />
          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    );
  }
}

export default Login;
