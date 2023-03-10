import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import ErrorBoundary from "./components/ErrorBoundary";
import ReactModal from "react-modal";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GQL_URL || "http://www.changqing.fun:3030/graphql",
  // uri: process.env.REACT_APP_GQL_URL || "http://localhost:3030/graphql",
  credentials: "include",
  cache: new InMemoryCache({ resultCaching: false }),
});

ReactDOM.render(
  <Provider store={configureStore()}>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ErrorBoundary>{[<App key="App" />]}</ErrorBoundary>
      </ApolloProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

ReactModal.setAppElement("#root");

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
