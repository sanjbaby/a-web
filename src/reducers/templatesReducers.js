import {
  CLOSE_TEMPLATE_FORM,
  DELETE_TEMPLATE_FAILURE,
  DELETE_TEMPLATE_REQUEST,
  DELETE_TEMPLATE_SUCCESS,
  LOAD_TEMPLATES_FAILURE,
  LOAD_TEMPLATES_REQUEST,
  LOAD_TEMPLATES_SUCCESS,
  OPEN_TEMPLATE_FORM,
  SAVE_TEMPLATE_FAILURE,
  SAVE_TEMPLATE_ISSUES,
  SAVE_TEMPLATE_REQUEST,
  SAVE_TEMPLATE_SUCCESS,
  SET_TEMPLATE_FILTER,
  TEMPLATE_RESET,
} from "../actions/templatesActions";

const templates = (
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
      name: "",
      path: "",
      owner: "",
      team: "",
      repo: "",
      template: { key: "value" },
      desc: "",
      guide: "",
      dashboard: {
        enabled: false,
        compatible: false,
      },
    },
    filter: "",
  },
  action
) => {
  switch (action.type) {
    case LOAD_TEMPLATES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        loadError: "",
      });
    case LOAD_TEMPLATES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loadError: action.error,
      });
    case LOAD_TEMPLATES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.templates,
      });
    case SAVE_TEMPLATE_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
        saveError: "",
        saveSuccess: false,
      });
    case SAVE_TEMPLATE_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        saveError: action.error,
      });
    case SAVE_TEMPLATE_ISSUES:
      return Object.assign({}, state, {
        isSaving: false,
        saveIssues: action.issues,
      });
    case SAVE_TEMPLATE_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        saveSuccess: true,
        formOpen: false,
      });
    case DELETE_TEMPLATE_REQUEST:
      return Object.assign({}, state, {
        isDeleting: true,
        deleteSuccess: false,
        deleteError: "",
      });
    case DELETE_TEMPLATE_FAILURE:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteError: action.error,
      });
    case DELETE_TEMPLATE_SUCCESS:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteSuccess: true,
        formOpen: false,
      });
    case TEMPLATE_RESET:
      return Object.assign({}, state, {
        saveError: "",
        saveSuccess: false,
        deleteError: "",
        deleteSuccess: false,
      });
    case OPEN_TEMPLATE_FORM:
      return Object.assign({}, state, {
        formOpen: true,
        formDefaultValues: action.values,
      });
    case CLOSE_TEMPLATE_FORM:
      return Object.assign({}, state, {
        formOpen: false,
        saveError: "",
        deleteError: "",
      });
    case SET_TEMPLATE_FILTER:
      return Object.assign({}, state, {
        filter: action.filter,
      });
    default:
      return state;
  }
};

export default templates;
