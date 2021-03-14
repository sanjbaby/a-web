import api from "../api";
import { batch } from "react-redux";

export const LOAD_INSTANCES_REQUEST = "LOAD_INSTANCES_REQUEST";
export const loadInstancesRequest = () => {
  return {
    type: LOAD_INSTANCES_REQUEST,
  };
};

export const LOAD_INSTANCES_FAILURE = "LOAD_INSTANCES_FAILURE";
export const loadInstancesFailure = (error) => {
  return {
    type: LOAD_INSTANCES_FAILURE,
    error,
  };
};

export const LOAD_INSTANCES_SUCCESS = "LOAD_INSTANCES_SUCCESS";
export const loadInstancesSuccess = (instances) => {
  return {
    type: LOAD_INSTANCES_SUCCESS,
    instances,
  };
};

export const loadInstances = (run_id) => {
  return (dispatch, getState) => {
    // Only fetch instances updates if isFetching is false
    if (!getState().instances.isFetching) {
      dispatch(loadInstancesRequest());

      api
        .get(`/instances?where={"run":"${run_id}"}&sort=index`)
        .then((response) => {
          if (response.status !== 200) {
            throw Error(response.statusText);
          }

          return response.data._items;
        })
        .then((data) => dispatch(loadInstancesSuccess(data)))
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          }
          dispatch(loadInstancesFailure(error.message));
        });
    }
  };
};

export const SAVE_INSTANCE_REQUEST = "SAVE_INSTANCE_REQUEST";
export const saveInstanceRequest = () => {
  return {
    type: SAVE_INSTANCE_REQUEST,
  };
};

export const SAVE_INSTANCE_SUCCESS = "SAVE_INSTANCE_SUCCESS";
export const saveInstanceSuccess = () => {
  return {
    type: SAVE_INSTANCE_SUCCESS,
  };
};

export const SAVE_INSTANCE_FAILURE = "SAVE_INSTANCE_FAILURE";
export const saveInstanceFailure = (error) => {
  return {
    type: SAVE_INSTANCE_FAILURE,
    error,
  };
};

export const saveInstance = (instance, id, etag) => {
  return (dispatch) => {
    dispatch(saveInstanceRequest());

    if (id) {
      api
        .patch("/instances/" + id, instance, {
          headers: {
            "If-Match": etag,
          },
        })
        .then((response) => {
          batch(() => {
            dispatch(saveInstanceSuccess());
            dispatch(loadInstances(instance.scenario));
            setTimeout(() => dispatch(instanceReset()), 5000);
          });
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          }
          dispatch(saveInstanceFailure(error.message));
        });
    } else {
      api
        .post("/instances", instance)
        .then((response) => {
          batch(() => {
            dispatch(saveInstanceSuccess());
            dispatch(loadInstances(instance.scenario));
            setTimeout(() => dispatch(instanceReset()), 5000);
          });
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          }
          dispatch(saveInstanceFailure(error.message));
        });
    }
  };
};

export const DELETE_INSTANCE_REQUEST = "DELETE_INSTANCE_REQUEST";
export const deleteInstanceRequest = () => {
  return {
    type: DELETE_INSTANCE_REQUEST,
  };
};

export const DELETE_INSTANCE_SUCCESS = "DELETE_INSTANCE_SUCCESS";
export const deleteInstanceSuccess = () => {
  return {
    type: DELETE_INSTANCE_SUCCESS,
  };
};

export const DELETE_INSTANCE_FAILURE = "DELETE_INSTANCE_FAILURE";
export const deleteInstanceFailure = (error) => {
  return {
    type: DELETE_INSTANCE_FAILURE,
    error,
  };
};

export const deleteInstance = (id, etag, scenario) => {
  return (dispatch) => {
    dispatch(deleteInstanceRequest());

    api
      .delete("/instances/" + id, {
        headers: {
          "If-Match": etag,
        },
      })
      .then((response) => {
        batch(() => {
          dispatch(deleteInstanceSuccess());
          dispatch(loadInstances(scenario));
          setTimeout(() => dispatch(instanceReset()), 5000);
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(deleteInstanceFailure(error.message));
      });
  };
};

export const INSTANCE_RESET = "INSTANCE_RESET";
export const instanceReset = () => {
  return {
    type: INSTANCE_RESET,
  };
};

export const OPEN_INSTANCE_FORM = "OPEN_INSTANCE_FORM";
export const openInstanceForm = (defaultValues) => {
  return {
    type: OPEN_INSTANCE_FORM,
    defaultValues,
  };
};

export const CLOSE_INSTANCE_FORM = "CLOSE_INSTANCE_FORM";
export const closeInstanceForm = () => {
  return {
    type: CLOSE_INSTANCE_FORM,
  };
};

export const TOGGLE_INSTANCE_ENABLED = "TOGGLE_INSTANCE_ENABLED";
export const toggleInstanceEnabled = (id) => {
  return {
    type: TOGGLE_INSTANCE_ENABLED,
    id,
  };
};

export const NEW_INSTANCES_ORDER = "NEW_INSTANCES_ORDER";
export const reorderInstances = (instances) => {
  return {
    type: NEW_INSTANCES_ORDER,
    instances,
  };
};

const saveInstanceWithoutAction = (instance, id, etag) => {
  return () => {
    return api.patch("/instances/" + id, instance, {
      headers: {
        "If-Match": etag,
      },
    });
  };
};

export const saveInstanceOrder = (items) => {
  return (dispatch) => {
    dispatch(saveInstanceRequest());
    dispatch(reorderInstances(items));

    const scenario_id = items[0].scenario;
    let index = -1;

    Promise.all(
      items.map((item) => {
        index = index + 1;
        return dispatch(
          saveInstanceWithoutAction(
            {
              index,
            },
            item._id,
            item._etag
          )
        );
      })
    )
      .then(() => {
        dispatch(saveInstanceSuccess());
      })
      .catch((error) => {
        dispatch(saveInstanceFailure(error.message));
      })
      .finally(() => {
        batch(() => {
          dispatch(loadInstances(scenario_id));
          setTimeout(() => dispatch(instanceReset()), 5000);
        });
      });
  };
};

export const SET_INSTANCE_FILTER = "SET_INSTANCE_FILTER";
export const setInstanceFilter = (filter) => {
  return {
    type: SET_INSTANCE_FILTER,
    filter
  };
};
