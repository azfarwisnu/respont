import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.js";
import "./asset/css/Chat.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Chat from "./pages/Chat";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route component={Chat} path="/" exact />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
