import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";
import { Template } from "./templates/Template";
import { Main } from "./pages/Main";
import { Sub } from "./pages/Sub";

const cache = new InMemoryCache();

const data = {
  todos: [],
  visibilityFilter: "SHOW_ALL",
  networkStatus: {
    __typename: "NetworkStatus",
    isConnected: false,
  },
};

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache,
  //   cacheRedirects: {
  //     Query: {
  //       item: (_, { id }, { getOneItem }) =>
  //         getOneItem({ id, __typename: "Item" }),
  //     },
  //   },
  resolvers: {
    Mutation: {
      addTodo: (_root, variables, { cache, getCacheKey }) => {
        //const id = getCacheKey({ __typename: "TodoItem", id: variables.id });
        const query = gql`
          query TodoQuery {
            todos {
              id
              completed
              text
            }
          }
        `;
        const data = cache.readQuery({ query });
        console.log(data);
        const myNewTodo = {
          ...variables,
          __typename: "Todo",
        };
        cache.writeQuery({
          query,
          data: { todos: [...data.todos, myNewTodo] },
        });
        return null;
      },
    },
  },
});

// initialize local state
cache.writeData({ data });
// reset the store, say a user logs out.
client.onResetStore(async () => await cache.writeData({ data }));

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
