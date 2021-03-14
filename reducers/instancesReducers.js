import {
  CLOSE_INSTANCE_FORM,
  DELETE_INSTANCE_FAILURE,
  DELETE_INSTANCE_REQUEST,
  DELETE_INSTANCE_SUCCESS,
  INSTANCE_RESET,
  LOAD_INSTANCES_FAILURE,
  LOAD_INSTANCES_REQUEST,
  LOAD_INSTANCES_SUCCESS,
  NEW_INSTANCES_ORDER,
  OPEN_INSTANCE_FORM,
  SAVE_INSTANCE_FAILURE,
  SAVE_INSTANCE_REQUEST,
  SAVE_INSTANCE_SUCCESS,
  SET_INSTANCE_FILTER,
} from "../actions/instancesActions";

const instances = (
  state = {
    isFetching: false,
    loadError: "",
    items: [],
    isSaving: false,
    saveError: "",
    saveSuccess: false,
    isDeleting: false,
    deleteError: "",
    deleteSuccess: false,
    formOpen: false,
    formDefaultValues: {},
    hasOrderChanged: false,
    filter: "",
  },
  action
) => {
  switch (action.type) {
    case LOAD_INSTANCES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        loadError: "",
      });
    case LOAD_INSTANCES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loadError: action.error,
      });
    case LOAD_INSTANCES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.instances,
        hasOrderChanged: false,
      });
    case SAVE_INSTANCE_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
        saveError: "",
        saveSuccess: false,
      });
    case SAVE_INSTANCE_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        saveError: action.error,
      });
    case SAVE_INSTANCE_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        saveSuccess: true,
        formOpen: false,
      });
    case DELETE_INSTANCE_REQUEST:
      return Object.assign({}, state, {
        isDeleting: true,
        deleteSuccess: false,
        deleteError: "",
      });
    case DELETE_INSTANCE_FAILURE:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteError: action.error,
      });
    case DELETE_INSTANCE_SUCCESS:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteSuccess: true,
        formOpen: false,
      });
    case INSTANCE_RESET:
      return Object.assign({}, state, {
        saveError: "",
        saveSuccess: false,
        deleteError: "",
        deleteSuccess: false,
      });
    case NEW_INSTANCES_ORDER:
      return Object.assign({}, state, {
        items: action.instances,
        hasOrderChanged: true,
      });
    case OPEN_INSTANCE_FORM:
      return Object.assign({}, state, {
        formOpen: true,
        formDefaultValues: action.defaultValues,
      });
    case CLOSE_INSTANCE_FORM:
      return Object.assign({}, state, {
        formOpen: false,
        saveError: "",
        deleteError: "",
      });
    case SET_INSTANCE_FILTER:
      return Object.assign({}, state, {
        filter: action.filter,
      });
    default:
      return state;
  }
};

export default instances;
