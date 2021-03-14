import {
  CLOSE_RUN_FORM,
  DELETE_RUN_FAILURE,
  DELETE_RUN_REQUEST,
  DELETE_RUN_SUCCESS,
  RUN_RESET,
  LOAD_RUNS_FAILURE,
  LOAD_RUNS_REQUEST,
  LOAD_RUNS_SUCCESS,
  LOAD_RUN_FAILURE,
  LOAD_RUN_REQUEST,
  LOAD_RUN_SUCCESS,
  OPEN_RUN_FORM,
  SAVE_RUN_FAILURE,
  SAVE_RUN_REQUEST,
  SAVE_RUN_SUCCESS,
  SET_RUN_FILTER,
} from "../actions/runsActions";

const runs = (
  state = {
    isFetching: false,
    loadError: "",
    items: [],
    runDetailsFetching: false,
    runDetailsError: "",
    runDetails: {},
    isSaving: false,
    saveError: "",
    saveSuccess: false,
    isDeleting: false,
    deleteError: "",
    deleteSuccess: false,
    formOpen: false,
    formDefaultValues: {},
    hasOrderChanged: false,
    filter: [],
  },
  action
) => {
  switch (action.type) {
    case LOAD_RUNS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        loadError: "",
      });
    case LOAD_RUNS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loadError: action.error,
      });
    case LOAD_RUNS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        items: state.items
          .filter((run) => !action.runs.some((newRun) => newRun._id === run._id))
          .concat(action.runs),
        hasOrderChanged: false,
      });
    case LOAD_RUN_REQUEST:
      return Object.assign({}, state, {
        runDetailsFetching: true,
        runDetailsError: "",
      });
    case LOAD_RUN_FAILURE:
      return Object.assign({}, state, {
        runDetailsFetching: false,
        runDetailsError: action.error,
      });
    case LOAD_RUN_SUCCESS:
      return Object.assign({}, state, {
        runDetailsFetching: false,
        runDetails: action.run,
      });
    case SAVE_RUN_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
        saveError: "",
        saveSuccess: false,
      });
    case SAVE_RUN_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        saveError: action.error,
      });
    case SAVE_RUN_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        saveSuccess: true,
        formOpen: false,
      });
    case DELETE_RUN_REQUEST:
      return Object.assign({}, state, {
        isDeleting: true,
        deleteSuccess: false,
        deleteError: "",
      });
    case DELETE_RUN_FAILURE:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteError: action.error,
      });
    case DELETE_RUN_SUCCESS:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteSuccess: true,
        formOpen: false,
        items: state.items.filter((run) => run._id !== action.run._id),
      });
    case RUN_RESET:
      return Object.assign({}, state, {
        saveError: "",
        saveSuccess: false,
        deleteError: "",
        deleteSuccess: false,
      });
    case OPEN_RUN_FORM:
      return Object.assign({}, state, {
        formOpen: true,
        formDefaultValues: action.defaultValues,
      });
    case CLOSE_RUN_FORM:
      return Object.assign({}, state, {
        formOpen: false,
        saveError: "",
        deleteError: "",
      });
    case SET_RUN_FILTER:
      let filter = [...state.filter];
      filter.indexOf(action.filter) === -1
        ? filter.push(action.filter)
        : filter.splice(filter.indexOf(action.filter), 1);
      return Object.assign({}, state, {
        filter,
      });
    default:
      return state;
  }
};

export default runs;
