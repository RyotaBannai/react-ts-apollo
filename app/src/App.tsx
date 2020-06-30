import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, concat } from "apollo-link";
import gql from "graphql-tag";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";
import { Index } from "./pages/layouts/Index";
import { Main } from "./pages/Main";
import { Sub } from "./pages/Sub";
import { Pagination } from "./pages/DemoPagination";

const cache = new InMemoryCache({
  cacheRedirects: {
    // useful if you have a list of item in the cache and want to get a few item from them.
    Query: {
      item: (_, { id }, { getOneItem }) =>
        getOneItem({ id, __typename: "Item" }),
    },
  },
});
const data = {
  todos: [],
  visibilityFilter: "SHOW_ALL",
  networkStatus: {
    __typename: "NetworkStatus",
    isConnected: false,
  },
};
// initialize local state
cache.writeData({ data });

const link = new HttpLink({ uri: "http://localhost:4000/graphql" });
const client = new ApolloClient({
  link,
  cache,
  resolvers: {
    /** Please define resolvers in each component  addResolvers API **/
  },
});
// reset the store, say a user logs out.
client.onResetStore(async () => await cache.writeData({ data }));

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <Index>
            <Route exact path="/" component={Main} />
            <Route exact path="/sub" component={Sub} />
            <Route exact path="/pagination" component={Pagination} />
          </Index>
        </Router>
      </div>
    </ApolloProvider>
  );
}
