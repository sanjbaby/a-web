import api from "../api";
import { batch } from "react-redux";

export const LOAD_VARIABLES_REQUEST = "LOAD_VARIABLES_REQUEST";
export const loadVariablesRequest = () => {
  return {
    type: LOAD_VARIABLES_REQUEST,
  };
};

export const LOAD_VARIABLES_FAILURE = "LOAD_VARIABLES_FAILURE";
export const loadVariablesFailure = (error) => {
  return {
    type: LOAD_VARIABLES_FAILURE,
    error,
  };
};

export const LOAD_VARIABLES_SUCCESS = "LOAD_VARIABLES_SUCCESS";
export const loadVariablesSuccess = (variables) => {
  return {
    type: LOAD_VARIABLES_SUCCESS,
    variables,
  };
};

export const loadVariables = () => {
  return (dispatch) => {
    dispatch(loadVariablesRequest());

    api
      .get("/variables?sort=env")
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }

        return response.data._items;
      })
      .then((data) => dispatch(loadVariablesSuccess(data)))
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(loadVariablesFailure(error.message));
      });
  };
};

export const SAVE_VARIABLE_REQUEST = "SAVE_VARIABLE_REQUEST";
export const saveVariableRequest = () => {
  return {
    type: SAVE_VARIABLE_REQUEST,
  };
};

export const SAVE_VARIABLE_SUCCESS = "SAVE_VARIABLE_SUCCESS";
export const saveVariableSuccess = () => {
  return {
    type: SAVE_VARIABLE_SUCCESS,
  };
};

export const SAVE_VARIABLE_FAILURE = "SAVE_VARIABLE_FAILURE";
export const saveVariableFailure = (error) => {
  return {
    type: SAVE_VARIABLE_FAILURE,
    error,
  };
};

export const SAVE_VARIABLE_ISSUES = "SAVE_VARIABLE_ISSUES";
export const saveVariableIssues = (issues) => {
  const saveIssues = Object.entries(issues).map((issue) => {
    return {
      name: issue[0],
      message: issue[1],
    };
  });
  return {
    type: SAVE_VARIABLE_ISSUES,
    issues: saveIssues,
  };
};

export const saveVariable = (variable, id, etag) => {
  return (dispatch) => {
    dispatch(saveVariableRequest());

    if (id) {
      api
        .patch("/variables/" + id, variable, {
          headers: {
            "If-Match": etag,
          },
        })
        .then((response) => {
          batch(() => {
            dispatch(saveVariableSuccess());
            dispatch(loadVariables());
            setTimeout(() => dispatch(variableReset()), 5000);
          });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          if (error.response.data) {
            dispatch(saveVariableIssues(error.response.data._issues));
          } else {
            dispatch(saveVariableFailure(error.message));
          }
        });
    } else {
      api
        .post("/variables", variable)
        .then((response) => {
          batch(() => {
            dispatch(saveVariableSuccess());
            dispatch(loadVariables());
            setTimeout(() => dispatch(variableReset()), 5000);
          });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          if (error.response.data) {
            dispatch(saveVariableIssues(error.response.data._issues));
          } else {
            dispatch(saveVariableFailure(error.message));
          }
        });
    }
  };
};

export const DELETE_VARIABLE_REQUEST = "DELETE_VARIABLE_REQUEST";
export const deleteVariableRequest = () => {
  return {
    type: DELETE_VARIABLE_REQUEST,
  };
};

export const DELETE_VARIABLE_SUCCESS = "DELETE_VARIABLE_SUCCESS";
export const deleteVariableSuccess = () => {
  return {
    type: DELETE_VARIABLE_SUCCESS,
  };
};

export const DELETE_VARIABLE_FAILURE = "DELETE_VARIABLE_FAILURE";
export const deleteVariableFailure = (error) => {
  return {
    type: DELETE_VARIABLE_FAILURE,
    error,
  };
};

export const deleteVariable = (id, etag) => {
  return (dispatch) => {
    dispatch(deleteVariableRequest());

    api
      .delete("/variables/" + id, {
        headers: {
          "If-Match": etag,
        },
      })
      .then((response) => {
        batch(() => {
          dispatch(deleteVariableSuccess());
          dispatch(loadVariables());
          setTimeout(() => dispatch(variableReset()), 5000);
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(deleteVariableFailure(error.message));
      });
  };
};

export const VARIABLE_RESET = "VARIABLE_RESET";
export const variableReset = () => {
  return {
    type: VARIABLE_RESET,
  };
};

export const OPEN_VARIABLE_FORM = "OPEN_VARIABLE_FORM";
export const openVariableForm = (values) => {
  return {
    type: OPEN_VARIABLE_FORM,
    values,
  };
};

export const CLOSE_VARIABLE_FORM = "CLOSE_VARIABLE_FORM";
export const closeVariableForm = () => {
  return {
    type: CLOSE_VARIABLE_FORM,
  };
};
