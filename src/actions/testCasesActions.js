import api from "../api";
import { batch } from "react-redux";

export const LOAD_TEST_CASES_REQUEST = "LOAD_TEST_CASES_REQUEST";
export const loadTestCasesRequest = () => {
  return {
    type: LOAD_TEST_CASES_REQUEST,
  };
};

export const LOAD_TEST_CASES_FAILURE = "LOAD_TEST_CASES_FAILURE";
export const loadTestCasesFailure = (error) => {
  return {
    type: LOAD_TEST_CASES_FAILURE,
    error,
  };
};

export const LOAD_TEST_CASES_SUCCESS = "LOAD_TEST_CASES_SUCCESS";
export const loadTestCasesSuccess = (testCases) => {
  return {
    type: LOAD_TEST_CASES_SUCCESS,
    testCases,
  };
};

export const loadTestCases = (id) => {
  return (dispatch) => {
    dispatch(loadTestCasesRequest());

    api
      .get('/test_cases?where={"scenario":"' + id + '"}&sort=index')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }

        return response.data._items;
      })
      .then((data) => dispatch(loadTestCasesSuccess(data)))
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(loadTestCasesFailure(error.message));
      });
  };
};

export const SAVE_TEST_CASE_REQUEST = "SAVE_TEST_CASE_REQUEST";
export const saveTestCaseRequest = () => {
  return {
    type: SAVE_TEST_CASE_REQUEST,
  };
};

export const SAVE_TEST_CASE_SUCCESS = "SAVE_TEST_CASE_SUCCESS";
export const saveTestCaseSuccess = () => {
  return {
    type: SAVE_TEST_CASE_SUCCESS,
  };
};

export const SAVE_TEST_CASE_FAILURE = "SAVE_TEST_CASE_FAILURE";
export const saveTestCaseFailure = (error) => {
  return {
    type: SAVE_TEST_CASE_FAILURE,
    error,
  };
};

export const saveTestCase = (testCase, id, etag) => {
  return (dispatch) => {
    dispatch(saveTestCaseRequest());

    if (id) {
      api
        .patch("/test_cases/" + id, testCase, {
          headers: {
            "If-Match": etag,
          },
        })
        .then((response) => {
          batch(() => {
            dispatch(saveTestCaseSuccess());
            dispatch(loadTestCases(testCase.scenario));
            setTimeout(() => dispatch(testCaseReset()), 5000);
          });
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          }
          dispatch(saveTestCaseFailure(error.message));
        });
    } else {
      api
        .post("/test_cases", testCase)
        .then((response) => {
          batch(() => {
            dispatch(saveTestCaseSuccess());
            dispatch(loadTestCases(testCase.scenario));
            setTimeout(() => dispatch(testCaseReset()), 5000);
          });
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          }
          dispatch(saveTestCaseFailure(error.message));
        });
    }
  };
};

export const DELETE_TEST_CASE_REQUEST = "DELETE_TEST_CASE_REQUEST";
export const deleteTestCaseRequest = () => {
  return {
    type: DELETE_TEST_CASE_REQUEST,
  };
};

export const DELETE_TEST_CASE_SUCCESS = "DELETE_TEST_CASE_SUCCESS";
export const deleteTestCaseSuccess = () => {
  return {
    type: DELETE_TEST_CASE_SUCCESS,
  };
};

export const DELETE_TEST_CASE_FAILURE = "DELETE_TEST_CASE_FAILURE";
export const deleteTestCaseFailure = (error) => {
  return {
    type: DELETE_TEST_CASE_FAILURE,
    error,
  };
};

export const deleteTestCase = (id, etag, scenario) => {
  return (dispatch) => {
    dispatch(deleteTestCaseRequest());

    api
      .delete("/test_cases/" + id, {
        headers: {
          "If-Match": etag,
        },
      })
      .then((response) => {
        batch(() => {
          dispatch(deleteTestCaseSuccess());
          dispatch(loadTestCases(scenario));
          setTimeout(() => dispatch(testCaseReset()), 5000);
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(deleteTestCaseFailure(error.message));
      });
  };
};

export const TEST_CASE_RESET = "TEST_CASE_RESET";
export const testCaseReset = () => {
  return {
    type: TEST_CASE_RESET,
  };
};

export const OPEN_TEST_CASE_FORM = "OPEN_TEST_CASE_FORM";
export const openTestCaseForm = (defaultValues) => {
  return {
    type: OPEN_TEST_CASE_FORM,
    defaultValues,
  };
};

export const CLOSE_TEST_CASE_FORM = "CLOSE_TEST_CASE_FORM";
export const closeTestCaseForm = () => {
  return {
    type: CLOSE_TEST_CASE_FORM,
  };
};

export const TOGGLE_TEST_CASE_ENABLED = "TOGGLE_TEST_CASE_ENABLED";
export const toggleTestCaseEnabled = (id) => {
  return {
    type: TOGGLE_TEST_CASE_ENABLED,
    id,
  };
};

export const NEW_TEST_CASES_ORDER = "NEW_TEST_CASES_ORDER";
export const reorderTestCases = (testCases) => {
  return {
    type: NEW_TEST_CASES_ORDER,
    testCases,
  };
};

const saveTestCaseWithoutAction = (testCase, id, etag) => {
  return () => {
    return api.patch("/test_cases/" + id, testCase, {
      headers: {
        "If-Match": etag,
      },
    });
  };
};

export const saveTestCaseOrder = (items) => {
  return (dispatch) => {
    dispatch(saveTestCaseRequest());
    dispatch(reorderTestCases(items));

    const scenario_id = items[0].scenario;
    let index = -1;

    Promise.all(
      items.map((item) => {
        index = index + 1;
        return dispatch(
          saveTestCaseWithoutAction(
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
        dispatch(saveTestCaseSuccess());
      })
      .catch((error) => {
        dispatch(saveTestCaseFailure(error.message));
      })
      .finally(() => {
        batch(() => {
          dispatch(loadTestCases(scenario_id));
          setTimeout(() => dispatch(testCaseReset()), 5000);
        });
      });
  };
};

export const SET_TEST_CASE_FILTER = "SET_TEST_CASE_FILTER";
export const setTestCaseFilter = (filter) => {
  return {
    type: SET_TEST_CASE_FILTER,
    filter,
  };
};
