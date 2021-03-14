import api from "../api";
import { batch } from "react-redux";

export const LOAD_CONNECTIONS_REQUEST = "LOAD_CONNECTIONS_REQUEST";
export const loadConnectionsRequest = () => {
  return {
    type: LOAD_CONNECTIONS_REQUEST,
  };
};

export const LOAD_CONNECTIONS_FAILURE = "LOAD_CONNECTIONS_FAILURE";
export const loadConnectionsFailure = (error) => {
  return {
    type: LOAD_CONNECTIONS_FAILURE,
    error,
  };
};

export const LOAD_CONNECTIONS_SUCCESS = "LOAD_CONNECTIONS_SUCCESS";
export const loadConnectionsSuccess = (connections) => {
  return {
    type: LOAD_CONNECTIONS_SUCCESS,
    connections,
  };
};

export const loadConnections = () => {
  return (dispatch) => {
    dispatch(loadConnectionsRequest());

    api
      .get("/connections?sort=name")
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }

        return response.data._items;
      })
      .then((data) => dispatch(loadConnectionsSuccess(data)))
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(loadConnectionsFailure(error.message));
      });
  };
};

export const SAVE_CONNECTION_REQUEST = "SAVE_CONNECTION_REQUEST";
export const saveConnectionRequest = () => {
  return {
    type: SAVE_CONNECTION_REQUEST,
  };
};

export const SAVE_CONNECTION_SUCCESS = "SAVE_CONNECTION_SUCCESS";
export const saveConnectionSuccess = () => {
  return {
    type: SAVE_CONNECTION_SUCCESS,
  };
};

export const SAVE_CONNECTION_FAILURE = "SAVE_CONNECTION_FAILURE";
export const saveConnectionFailure = (error) => {
  return {
    type: SAVE_CONNECTION_FAILURE,
    error,
  };
};

export const SAVE_CONNECTION_ISSUES = "SAVE_CONNECTION_ISSUES";
export const saveConnectionIssues = (issues) => {
  const saveIssues = Object.entries(issues).map((issue) => {
    return {
      name: issue[0],
      message: issue[1],
    };
  });
  return {
    type: SAVE_CONNECTION_ISSUES,
    issues: saveIssues,
  };
};

export const saveConnection = (connection, id, etag) => {
  return (dispatch) => {
    dispatch(saveConnectionRequest());

    if (id) {
      api
        .put("/connections/" + id, connection, {
          headers: {
            "If-Match": etag,
          },
        })
        .then((response) => {
          batch(() => {
            dispatch(saveConnectionSuccess());
            dispatch(loadConnections());
            setTimeout(() => dispatch(connectionReset()), 5000);
          });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          if (error.response.data) {
            dispatch(saveConnectionIssues(error.response.data._issues));
          } else {
            dispatch(saveConnectionFailure(error.message));
          }
        });
    } else {
      api
        .post("/connections", connection)
        .then((response) => {
          batch(() => {
            dispatch(saveConnectionSuccess());
            dispatch(loadConnections());
            setTimeout(() => dispatch(connectionReset()), 5000);
          });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          if (error.response.data) {
            dispatch(saveConnectionIssues(error.response.data._issues));
          } else {
            dispatch(saveConnectionFailure(error.message));
          }
        });
    }
  };
};

export const DELETE_CONNECTION_REQUEST = "DELETE_CONNECTION_REQUEST";
export const deleteConnectionRequest = () => {
  return {
    type: DELETE_CONNECTION_REQUEST,
  };
};

export const DELETE_CONNECTION_SUCCESS = "DELETE_CONNECTION_SUCCESS";
export const deleteConnectionSuccess = () => {
  return {
    type: DELETE_CONNECTION_SUCCESS,
  };
};

export const DELETE_CONNECTION_FAILURE = "DELETE_CONNECTION_FAILURE";
export const deleteConnectionFailure = (error) => {
  return {
    type: DELETE_CONNECTION_FAILURE,
    error,
  };
};

export const deleteConnection = (id, etag) => {
  return (dispatch) => {
    dispatch(deleteConnectionRequest());

    api
      .delete("/connections/" + id, {
        headers: {
          "If-Match": etag,
        },
      })
      .then((response) => {
        batch(() => {
          dispatch(deleteConnectionSuccess());
          dispatch(loadConnections());
          setTimeout(() => dispatch(connectionReset()), 5000);
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(deleteConnectionFailure(error.message));
      });
  };
};

export const CONNECTION_RESET = "CONNECTION_RESET";
export const connectionReset = () => {
  return {
    type: CONNECTION_RESET,
  };
};

export const OPEN_CONNECTION_FORM = "OPEN_CONNECTION_FORM";
export const openConnectionForm = (values) => {
  return {
    type: OPEN_CONNECTION_FORM,
    values,
  };
};

export const CLOSE_CONNECTION_FORM = "CLOSE_CONNECTION_FORM";
export const closeConnectionForm = () => {
  return {
    type: CLOSE_CONNECTION_FORM,
  };
};
