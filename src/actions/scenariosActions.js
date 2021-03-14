import api from "../api";
import { batch } from "react-redux";
import _ from "lodash";

export const LOAD_SCENARIOS_REQUEST = "LOAD_SCENARIOS_REQUEST";
export const loadScenariosRequest = () => {
  return {
    type: LOAD_SCENARIOS_REQUEST,
  };
};

export const LOAD_SCENARIOS_FAILURE = "LOAD_SCENARIOS_FAILURE";
export const loadScenariosFailure = (error) => {
  return {
    type: LOAD_SCENARIOS_FAILURE,
    error,
  };
};

export const LOAD_SCENARIOS_SUCCESS = "LOAD_SCENARIOS_SUCCESS";
export const loadScenariosSuccess = (scenarios) => {
  return {
    type: LOAD_SCENARIOS_SUCCESS,
    scenarios,
  };
};

export const loadScenarios = () => {
  return (dispatch) => {
    dispatch(loadScenariosRequest());

    api
      .get("/scenarios?sort=-_updated")
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }

        return response.data._items;
      })
      .then((data) => dispatch(loadScenariosSuccess(data)))
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(loadScenariosFailure(error.message));
      });
  };
};

export const loadScenario = (id) => {
  return (dispatch) => {
    dispatch(loadScenariosRequest());

    api
    .get("/scenarios/" + id)
    .then((response) => {
      if (response.status !== 200) {
        throw Error(response.statusText);
      }

      return response.data;
    })
    .then((data) => dispatch(loadScenariosSuccess([data])))
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      }
      dispatch(loadScenariosFailure(error.message));
    });
  };
};

export const SAVE_SCENARIO_REQUEST = "SAVE_SCENARIO_REQUEST";
export const saveScenarioRequest = () => {
  return {
    type: SAVE_SCENARIO_REQUEST,
  };
};

export const SAVE_SCENARIO_SUCCESS = "SAVE_SCENARIO_SUCCESS";
export const saveScenarioSuccess = () => {
  return {
    type: SAVE_SCENARIO_SUCCESS,
  };
};

export const SAVE_SCENARIO_FAILURE = "SAVE_SCENARIO_FAILURE";
export const saveScenarioFailure = (error) => {
  return {
    type: SAVE_SCENARIO_FAILURE,
    error,
  };
};

export const SAVE_SCENARIO_ISSUES = "SAVE_SCENARIO_ISSUES";
export const saveScenarioIssues = (issues) => {
  const saveIssues = Object.entries(issues).map((issue) => {
    return {
      name: issue[0],
      message: issue[1],
    };
  });
  return {
    type: SAVE_SCENARIO_ISSUES,
    issues: saveIssues,
  };
};

export const saveScenario = (scenario, clone_id = "") => {
  return (dispatch) => {
    dispatch(saveScenarioRequest());

    if (scenario._id) {
      api
        .patch("/scenarios/" + scenario._id, _.omit(_.omit(scenario, "_id"), "_etag"), {
          headers: {
            "If-Match": scenario._etag,
          },
        })
        .then((response) => {
          batch(() => {
            dispatch(saveScenarioSuccess());
            dispatch(loadScenarios());
            setTimeout(() => dispatch(scenarioReset()), 5000);
          });
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data) {
            dispatch(saveScenarioIssues(error.response.data._issues));
          } else {
            dispatch(saveScenarioFailure(error.message));
          }
        });
    } else {
      api
        .post("/scenarios", scenario)
        .then((response) => {
          if (clone_id) {
            api
              .post("/clone", {
                new_scenario: response.data._id,
                cloned_scenario: clone_id,
              })
              .then((response) => console.log("TestCases cloned."))
              .catch((error) => console.log(error));
          }
        })
        .then(() => {
          batch(() => {
            dispatch(saveScenarioSuccess());
            dispatch(loadScenarios());
            setTimeout(() => dispatch(scenarioReset()), 5000);
          });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          if (error.response.data) {
            dispatch(saveScenarioIssues(error.response.data._issues));
          } else {
            dispatch(saveScenarioFailure(error.message));
          }
        });
    }
  };
};

export const DELETE_SCENARIO_REQUEST = "DELETE_SCENARIO_REQUEST";
export const deleteScenarioRequest = () => {
  return {
    type: DELETE_SCENARIO_REQUEST,
  };
};

export const DELETE_SCENARIO_SUCCESS = "DELETE_SCENARIO_SUCCESS";
export const deleteScenarioSuccess = () => {
  return {
    type: DELETE_SCENARIO_SUCCESS,
  };
};

export const DELETE_SCENARIO_FAILURE = "DELETE_SCENARIO_FAILURE";
export const deleteScenarioFailure = (error) => {
  return {
    type: DELETE_SCENARIO_FAILURE,
    error,
  };
};

export const deleteScenario = (id, etag, history) => {
  return (dispatch) => {
    dispatch(deleteScenarioRequest());

    api
      .delete("/scenarios/" + id, {
        headers: {
          "If-Match": etag,
        },
      })
      .then((response) => {
        batch(() => {
          dispatch(deleteScenarioSuccess());
          dispatch(loadScenarios());
          setTimeout(() => dispatch(scenarioReset()), 5000);
        });
        history.push("/scenarios");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(deleteScenarioFailure(error.message));
      });
  };
};

export const SCENARIO_RESET = "SCENARIO_RESET";
export const scenarioReset = () => {
  return {
    type: SCENARIO_RESET,
  };
};

export const OPEN_SCENARIO_FORM = "OPEN_SCENARIO_FORM";
export const openScenarioForm = (values) => {
  return {
    type: OPEN_SCENARIO_FORM,
    values,
  };
};

export const CLOSE_SCENARIO_FORM = "CLOSE_SCENARIO_FORM";
export const closeScenarioForm = () => {
  return {
    type: CLOSE_SCENARIO_FORM,
  };
};

export const SET_SCENARIO_FILTER = "SET_SCENARIO_FILTER";
export const setScenarioFilter = (filter) => {
  return {
    type: SET_SCENARIO_FILTER,
    filter,
  };
};
