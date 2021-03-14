// React
import React from "react";
import ReactDOM from "react-dom";

// applicationinsights
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import {
  ReactPlugin,
  withAITracking
} from "@microsoft/applicationinsights-react-js";

// Redux
import { Provider } from "react-redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { routerMiddleware, ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";

import createRootReducer from "./reducers/rootReducer";

// Material-UI
import "typeface-roboto";

// Base application
import App from "./App";

// Caching on client
import * as serviceWorker from "./serviceWorker";
import { Route, Switch } from "react-router";

const history = createBrowserHistory();

const store = configureStore({
  reducer: createRootReducer(history),
  middleware: [
    routerMiddleware(history),
    ...getDefaultMiddleware(
      { immutableCheck: false, serializableCheck: false })]
});

const reactPlugin = new ReactPlugin();

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: window._env_.APPINSIGHTS_INSTRUMENTATIONKEY,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: history }
    }
  }
});
appInsights.loadAppInsights();

class Index extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              exact
              path="/docs"
              render={() =>
                (window.location =
                  window.location.protocol +
                  "//" +
                  window.location.hostname +
                  ":" +
                  window.location.port +
                  "/docs/")
              }
            />
            <Route render={() => <App/>}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}

const AiIndex = withAITracking(reactPlugin, Index);

ReactDOM.render(<AiIndex/>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
