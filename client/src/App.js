import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Flights from "./components/layout/Flights";
import FlightDetail from "./components/layout/FlightDetail";
import setAuthToken from "./ultis/setAuthToken";
import Admin from "./components/auth/Admin";
import AddFlight from "./components/layout/AddFlight";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/admin" component={Admin} />
        <Route path="/add" exact component={AddFlight} />
        <Route path="/" exact component={Flights} />
        <Route path="/:id" exact component={FlightDetail} />
      </Switch>
    </Router>
  );
}

export default App;
