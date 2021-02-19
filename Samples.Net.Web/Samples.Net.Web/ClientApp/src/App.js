import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import Document from "./components/document/Document";
import { Search } from "./components/search/Search";

import "./custom.css";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />{" "}
        <Route exact path="/search/:query" component={Search} />{" "}
        <Route exact path="/document/:id" component={Document} />{" "}
      </Layout>
    );
  }
}
