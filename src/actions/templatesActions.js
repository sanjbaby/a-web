import api from "../api";
import { batch } from "react-redux";

export const LOAD_TEMPLATES_REQUEST = "LOAD_TEMPLATES_REQUEST";
export const loadTemplatesRequest = () => {
  return {
    type: LOAD_TEMPLATES_REQUEST,
  };
};

export const LOAD_TEMPLATES_FAILURE = "LOAD_TEMPLATES_FAILURE";
export const loadTemplatesFailure = (error) => {
  return {
    type: LOAD_TEMPLATES_FAILURE,
    error,
  };
};

export const LOAD_TEMPLATES_SUCCESS = "LOAD_TEMPLATES_SUCCESS";
export const loadTemplatesSuccess = (templates) => {
  return {
    type: LOAD_TEMPLATES_SUCCESS,
    templates,
  };
};

export const loadTemplates = () => {
  return (dispatch) => {
    dispatch(loadTemplatesRequest());

    api
      .get("/templates?sort=name")
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }

        return response.data._items;
      })
      .then((data) => dispatch(loadTemplatesSuccess(data)))
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(loadTemplatesFailure(error.message));
      });
  };
};

export const SAVE_TEMPLATE_REQUEST = "SAVE_TEMPLATE_REQUEST";
export const saveTemplateRequest = () => {
  return {
    type: SAVE_TEMPLATE_REQUEST,
  };
};

export const SAVE_TEMPLATE_SUCCESS = "SAVE_TEMPLATE_SUCCESS";
export const saveTemplateSuccess = () => {
  return {
    type: SAVE_TEMPLATE_SUCCESS,
  };
};

export const SAVE_TEMPLATE_FAILURE = "SAVE_TEMPLATE_FAILURE";
export const saveTemplateFailure = (error) => {
  return {
    type: SAVE_TEMPLATE_FAILURE,
    error,
  };
};

export const SAVE_TEMPLATE_ISSUES = "SAVE_TEMPLATE_ISSUES";
export const saveTemplateIssues = (issues) => {
  const saveIssues = Object.entries(issues).map((issue) => {
    return {
      name: issue[0],
      message: issue[1],
    };
  });
  return {
    type: SAVE_TEMPLATE_ISSUES,
    issues: saveIssues,
  };
};

export const saveTemplate = (template, id, etag) => {
  return (dispatch) => {
    dispatch(saveTemplateRequest());

    if (id) {
      api
        .patch("/templates/" + id, template, {
          headers: {
            "If-Match": etag,
          },
        })
        .then((response) => {
          batch(() => {
            dispatch(saveTemplateSuccess());
            dispatch(loadTemplates());
            setTimeout(() => dispatch(templateReset()), 5000);
          });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          if (error.response.data) {
            dispatch(saveTemplateIssues(error.response.data._issues));
          } else {
            dispatch(saveTemplateFailure(error.message));
          }
        });
    } else {
      api
        .post("/templates", template)
        .then((response) => {
          batch(() => {
            dispatch(saveTemplateSuccess());
            dispatch(loadTemplates());
            setTimeout(() => dispatch(templateReset()), 5000);
          });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          if (error.response.data) {
            dispatch(saveTemplateIssues(error.response.data._issues));
          } else {
            dispatch(saveTemplateFailure(error.message));
          }
        });
    }
  };
};

export const DELETE_TEMPLATE_REQUEST = "DELETE_TEMPLATE_REQUEST";
export const deleteTemplateRequest = () => {
  return {
    type: DELETE_TEMPLATE_REQUEST,
  };
};

export const DELETE_TEMPLATE_SUCCESS = "DELETE_TEMPLATE_SUCCESS";
export const deleteTemplateSuccess = () => {
  return {
    type: DELETE_TEMPLATE_SUCCESS,
  };
};

export const DELETE_TEMPLATE_FAILURE = "DELETE_TEMPLATE_FAILURE";
export const deleteTemplateFailure = (error) => {
  return {
    type: DELETE_TEMPLATE_FAILURE,
    error,
  };
};

export const deleteTemplate = (id, etag) => {
  return (dispatch) => {
    dispatch(deleteTemplateRequest());

    api
      .delete("/templates/" + id, {
        headers: {
          "If-Match": etag,
        },
      })
      .then((response) => {
        batch(() => {
          dispatch(deleteTemplateSuccess());
          dispatch(loadTemplates());
          setTimeout(() => dispatch(templateReset()), 5000);
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
        dispatch(deleteTemplateFailure(error.message));
      });
  };
};

export const TEMPLATE_RESET = "TEMPLATE_RESET";
export const templateReset = () => {
  return {
    type: TEMPLATE_RESET,
  };
};

export const OPEN_TEMPLATE_FORM = "OPEN_TEMPLATE_FORM";
export const openTemplateForm = (values) => {
  return {
    type: OPEN_TEMPLATE_FORM,
    values,
  };
};

export const CLOSE_TEMPLATE_FORM = "CLOSE_TEMPLATE_FORM";
export const closeTemplateForm = () => {
  return {
    type: CLOSE_TEMPLATE_FORM,
  };
};

export const SET_TEMPLATE_FILTER = "SET_TEMPLATE_FILTER";
export const setTemplateFilter = (filter) => {
  return {
    type: SET_TEMPLATE_FILTER,
    filter,
  };
};
