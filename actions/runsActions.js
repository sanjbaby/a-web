import api from "../api";
import { batch } from "react-redux";

export const LOAD_RUNS_REQUEST = "LOAD_RUNS_REQUEST";
export const loadRunsRequest = () => {
  return {
    type: LOAD_RUNS_REQUEST,
  };
};

export const LOAD_RUNS_FAILURE = "LOAD_RUNS_FAILURE";
export const loadRunsFailure = (error) => {
  return {
    type: LOAD_RUNS_FAILURE,
    error,
  };
};

export const LOAD_RUNS_SUCCESS = "LOAD_RUNS_SUCCESS";
export const loadRunsSuccess = (runs) => {
  return {
    type: LOAD_RUNS_SUCCESS,
    runs,
  };
};

export const loadRuns = (limit = null) => {
  return (dispatch, getState) => {
    // Only fetch runs updates if isFetching is false
    if (!getState().runs.isFetching) {
      dispatch(loadRunsRequest());

      let url = '/runs?sort=-_updated&projection={"status":1,"team":1,"scenario":1,"env":1}'

      if (limit !== null) {
        url = `${url}&max_results=${limit}`
      }

      api.get(url).then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }

        return response.data._items;
      }).then((data) => dispatch(loadRunsSuccess(data))).catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(loadRunsFailure(error.message));
      });
    };
  };
};

export const LOAD_RUN_REQUEST = "LOAD_RUN_REQUEST";
export const loadRunRequest = () => {
  return {
    type: LOAD_RUN_REQUEST,
  };
};

export const LOAD_RUN_FAILURE = "LOAD_RUN_FAILURE";
export const loadRunFailure = (error) => {
  return {
    type: LOAD_RUNS_FAILURE,
    error,
  };
};

export const LOAD_RUN_SUCCESS = "LOAD_RUN_SUCCESS";
export const loadRunSuccess = (run) => {
  return {
    type: LOAD_RUN_SUCCESS,
    run,
  };
};

export const loadRun = (id) => {
  return (dispatch) => {
    dispatch(loadRunRequest());

    api
      .get("/runs/" + id)
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }

        return response.data;
      })
      .then((data) => dispatch(loadRunSuccess(data)))
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(loadRunFailure(error.message));
      });
  };
};

export const SAVE_RUN_REQUEST = "SAVE_RUN_REQUEST";
export const saveRunRequest = () => {
  return {
    type: SAVE_RUN_REQUEST,
  };
};

export const SAVE_RUN_SUCCESS = "SAVE_RUN_SUCCESS";
export const saveRunSuccess = () => {
  return {
    type: SAVE_RUN_SUCCESS,
  };
};

export const SAVE_RUN_FAILURE = "SAVE_RUN_FAILURE";
export const saveRunFailure = (error) => {
  return {
    type: SAVE_RUN_FAILURE,
    error,
  };
};

export const saveRun = (run, id, etag) => {
  return (dispatch) => {
    dispatch(saveRunRequest());

    if (id) {
      api
        .patch("/runs/" + id, run, {
          headers: {
            "If-Match": etag,
          },
        })
        .then((response) => {
          batch(() => {
            dispatch(saveRunSuccess());
            dispatch(loadRuns());
            setTimeout(() => dispatch(runReset()), 5000);
          });
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          }
          dispatch(saveRunFailure(error.message));
        });
    } else {
      api
        .post("/runs", run)
        .then((response) => {
          batch(() => {
            dispatch(saveRunSuccess());
            dispatch(loadRuns());
            setTimeout(() => dispatch(runReset()), 5000);
          });
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          }
          dispatch(saveRunFailure(error.message));
        });
    }
  };
};

export const queueRun = (data, history) => {
  return (dispatch) => {
    dispatch(saveRunRequest());

    api
      .post("/queue", data)
      .then((response) => {
        batch(() => {
          dispatch(saveRunSuccess());
          dispatch(loadRuns());
          setTimeout(() => dispatch(runReset()), 5000);
        });
        history.push("/runs");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(saveRunFailure(error.message));
      });
  };
};

export const DELETE_RUN_REQUEST = "DELETE_RUN_REQUEST";
export const deleteRunRequest = () => {
  return {
    type: DELETE_RUN_REQUEST,
  };
};

export const DELETE_RUN_SUCCESS = "DELETE_RUN_SUCCESS";
export const deleteRunSuccess = (run) => {
  return {
    type: DELETE_RUN_SUCCESS,
    run,
  };
};

export const DELETE_RUN_FAILURE = "DELETE_RUN_FAILURE";
export const deleteRunFailure = (error) => {
  return {
    type: DELETE_RUN_FAILURE,
    error,
  };
};

export const deleteRun = (run, history) => {
  return (dispatch) => {
    dispatch(deleteRunRequest());

    api
      .delete("/runs/" + run._id, {
        headers: {
          "If-Match": run._etag,
        },
      })
      .then((response) => {
        history.push("/runs");
        batch(() => {
          dispatch(deleteRunSuccess(run));
          setTimeout(() => dispatch(runReset()), 5000);
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(deleteRunFailure(error.message));
      });
  };
};

export const cancelRun = (id) => {
  return (dispatch) => {
    dispatch(deleteRunRequest());

    api
      .get("/cancel/" + id)
      .then((response) => {
        batch(() => {
          dispatch(deleteRunSuccess());
          dispatch(loadRuns());
          setTimeout(() => dispatch(runReset()), 5000);
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(deleteRunFailure(error.message));
      });
  };
};

export const RUN_RESET = "RUN_RESET";
export const runReset = () => {
  return {
    type: RUN_RESET,
  };
};

export const OPEN_RUN_FORM = "OPEN_RUN_FORM";
export const openRunForm = (defaultValues) => {
  return {
    type: OPEN_RUN_FORM,
    defaultValues,
  };
};

export const CLOSE_RUN_FORM = "CLOSE_RUN_FORM";
export const closeRunForm = () => {
  return {
    type: CLOSE_RUN_FORM,
  };
};

export const SET_RUN_FILTER = "SET_RUN_FILTER";
export const setRunFilter = (filter) => {
  return {
    type: SET_RUN_FILTER,
    filter,
  };
};
