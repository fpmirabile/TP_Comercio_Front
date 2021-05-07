import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Store from "./store";
import Admin from "./admin";
import "./App.scss";
import Products from "./store/pages/products";
import Header from "./store/header";
import Footer from "./store/footer";

export default class App extends React.PureComponent {
  render() {
    return (
      // Browser router porque queremos las url identicas sin #
      <BrowserRouter basename="/">
        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/products" exact>
            <Header />
            <Products title="Productos"  />
            <Footer />
          </Route>
          <Route path="/">
            <Store />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
