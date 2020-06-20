import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import { Template } from './templates/Template'
import { Main } from "./pages/Main";

const client = new ApolloClient({
    uri: 'https://48p1r2roz4.sse.codesandbox.io',
});

export default function App() {
  return (
      <ApolloProvider client={client}>
        <div className="App">
            <Router>
                <Template>
                    <Route exact path="/" component={ Main } />
                </Template>
            </Router>

        </div>
      </ApolloProvider>
  );
}
