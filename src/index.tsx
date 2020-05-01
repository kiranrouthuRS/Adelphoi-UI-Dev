import React from "react";
import ReactDOM from "react-dom";
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import createHistory from 'history/createBrowserHistory';
import App from "./App";
import configureStore from './redux-modules/configureStore';
export const {store, persistor} = configureStore(createHistory());

ReactDOM.render( <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
      <App />
    </Router>
    </PersistGate>
  </Provider>, document.getElementById("root"));
