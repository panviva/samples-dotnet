import React from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Document } from "./components/document/Document";
import { Search } from "./components/search/Search";
import { Error } from "./components/Error";

import "./custom.css";

export const App = () => {
  return (
    <Layout>
      <Route exact path="/" component={Home} />{" "}
      <Route exact path="/search/:query?" component={Search} />{" "}
      <Route exact path="/document/:id" component={Document} />{" "}
      <Route exact path="/error/:status?/:message?" component={Error} />{" "}
    </Layout>
  );
};
