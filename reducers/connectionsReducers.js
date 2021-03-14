import {
  LOAD_CONNECTIONS_REQUEST,
  LOAD_CONNECTIONS_FAILURE,
  LOAD_CONNECTIONS_SUCCESS,
  SAVE_CONNECTION_REQUEST,
  SAVE_CONNECTION_FAILURE,
  SAVE_CONNECTION_SUCCESS,
  DELETE_CONNECTION_REQUEST,
  DELETE_CONNECTION_FAILURE,
  DELETE_CONNECTION_SUCCESS,
  CONNECTION_RESET,
  OPEN_CONNECTION_FORM,
  CLOSE_CONNECTION_FORM,
  SAVE_CONNECTION_ISSUES,
} from "../actions/connectionsActions";

const connections = (
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
    case LOAD_CONNECTIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        loadError: "",
      });
    case LOAD_CONNECTIONS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loadError: action.error,
      });
    case LOAD_CONNECTIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.connections,
      });
    case SAVE_CONNECTION_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
        saveError: "",
        saveSuccess: false,
      });
    case SAVE_CONNECTION_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        saveError: action.error,
      });
    case SAVE_CONNECTION_ISSUES:
      return Object.assign({}, state, {
        isSaving: false,
        saveIssues: action.issues,
      });
    case SAVE_CONNECTION_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        saveSuccess: true,
        formOpen: false,
      });
    case DELETE_CONNECTION_REQUEST:
      return Object.assign({}, state, {
        isDeleting: true,
        deleteSuccess: false,
        deleteError: "",
      });
    case DELETE_CONNECTION_FAILURE:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteError: action.error,
      });
    case DELETE_CONNECTION_SUCCESS:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteSuccess: true,
        formOpen: false,
      });
    case CONNECTION_RESET:
      return Object.assign({}, state, {
        saveError: "",
        saveSuccess: false,
        deleteError: "",
        deleteSuccess: false,
      });
    case OPEN_CONNECTION_FORM:
      return Object.assign({}, state, {
        formOpen: true,
        formDefaultValues: action.values,
      });
    case CLOSE_CONNECTION_FORM:
      return Object.assign({}, state, {
        formOpen: false,
        saveError: "",
        saveIssues: [],
        deleteError: "",
      });
    default:
      return state;
  }
};

export default connections;
