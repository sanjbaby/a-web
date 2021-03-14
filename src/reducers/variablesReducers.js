import {
  LOAD_VARIABLES_REQUEST,
  LOAD_VARIABLES_FAILURE,
  LOAD_VARIABLES_SUCCESS,
  SAVE_VARIABLE_REQUEST,
  SAVE_VARIABLE_FAILURE,
  SAVE_VARIABLE_SUCCESS,
  DELETE_VARIABLE_REQUEST,
  DELETE_VARIABLE_FAILURE,
  DELETE_VARIABLE_SUCCESS,
  VARIABLE_RESET,
  OPEN_VARIABLE_FORM,
  CLOSE_VARIABLE_FORM,
  SAVE_VARIABLE_ISSUES,
} from "../actions/variablesActions";

const variables = (
  state = {
    isFetching: false,
    loadError: "",
    items: [],
    isSaving: false,
    saveError: "",
    saveIssues: [],
    saveSuccess: false,
    isDeleting: false,
    deleteError: "",
    deleteSuccess: false,
    formOpen: false,
    formDefaultValues: {
      type: "",
      system: "",
      env: "",
      desc: "",
      config: {
        key: "value",
      },
    },
  },
  action
) => {
  switch (action.type) {
    case LOAD_VARIABLES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        loadError: "",
      });
    case LOAD_VARIABLES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loadError: action.error,
      });
    case LOAD_VARIABLES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.variables,
      });
    case SAVE_VARIABLE_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
        saveError: "",
        saveSuccess: false,
      });
    case SAVE_VARIABLE_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        saveError: action.error,
      });
    case SAVE_VARIABLE_ISSUES:
      return Object.assign({}, state, {
        isSaving: false,
        saveIssues: action.issues,
      });
    case SAVE_VARIABLE_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        saveSuccess: true,
        formOpen: false,
      });
    case DELETE_VARIABLE_REQUEST:
      return Object.assign({}, state, {
        isDeleting: true,
        deleteSuccess: false,
        deleteError: "",
      });
    case DELETE_VARIABLE_FAILURE:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteError: action.error,
      });
    case DELETE_VARIABLE_SUCCESS:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteSuccess: true,
        formOpen: false,
      });
    case VARIABLE_RESET:
      return Object.assign({}, state, {
        saveError: "",
        saveSuccess: false,
        deleteError: "",
        deleteSuccess: false,
      });
    case OPEN_VARIABLE_FORM:
      return Object.assign({}, state, {
        formOpen: true,
        formDefaultValues: action.values,
      });
    case CLOSE_VARIABLE_FORM:
      return Object.assign({}, state, {
        formOpen: false,
        saveError: "",
        deleteError: "",
      });
    default:
      return state;
  }
};

export default variables;
