import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import PrivateRoute from "../components/PrivateRoute";
import Login from "../views/Login";
import Home from "../views/Home/indexHome";

export default function Routes() {
  return (
    <Router>
      <Route path="/" exact component={Login} />
      <PrivateRoute path="/home" exact component={Home} />
    </Router>
  );
}