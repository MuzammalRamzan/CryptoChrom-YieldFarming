import React from "react";
import { Switch, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Navigate from "../components/Navigate/Navigate";
import Index from "../container/App";
import Token from "../components/Token/Token";
import Account from "../components/Account/Account";

const RoutesComponent = () => {
  return (
    <div>
      <Navbar address={""} connected={false} />
      <Navigate />
      <Switch>
        <Route path="/token" exact render={(props) => <Token />} />
        <Route path="/account" exact render={(props) => <Account />} />
        <Route path="/" exact render={(props) => <Index />} />
      </Switch>
    </div>
  );
};

export default RoutesComponent;
