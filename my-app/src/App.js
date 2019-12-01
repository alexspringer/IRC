import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "reactstrap";
import Chat from "./Chat";
import Login from "./Login";
import Channels from "./Channels";
import {
  BrowserRouter as Router,
  Switch,
  useLocation,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login} exact></Route>
        <Route path="/chat" component={Chat} exact></Route>
      </Switch>
    </Router>
  );
}

export default App;
