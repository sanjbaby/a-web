import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import connections from "./connectionsReducers";
import variables from "./variablesReducers";
import templates from "./templatesReducers";
import testCases from "./testCasesReducers";
import settings from "./settingsReducers";
import scenarios from "./scenariosReducers";
import instances from "./instancesReducers";
import runs from "./runsReducers";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    settings,
    connections,
    variables,
    templates,
    scenarios,
    testCases,
    instances,
    runs,
  });

export default createRootReducer;
