import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";
import { Template } from "./templates/Template";
import { Main } from "./pages/Main";
import { Sub } from "./pages/Sub";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cacheRedirects: {
    Query: {
      item: (_, { id }, { getOneItem }) =>
        getOneItem({ id, __typename: "Item" }),
    },
  },
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <Template>
            <Route exact path="/" component={Main} />
            <Route exact path="/sub" component={Sub} />
          </Template>
        </Router>
      </div>
    </ApolloProvider>
  );
}
