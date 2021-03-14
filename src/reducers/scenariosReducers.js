import {
  CLOSE_SCENARIO_FORM,
  DELETE_SCENARIO_FAILURE,
  DELETE_SCENARIO_REQUEST,
  DELETE_SCENARIO_SUCCESS,
  LOAD_SCENARIOS_FAILURE,
  LOAD_SCENARIOS_REQUEST,
  LOAD_SCENARIOS_SUCCESS,
  OPEN_SCENARIO_FORM,
  SAVE_SCENARIO_FAILURE,
  SAVE_SCENARIO_ISSUES,
  SAVE_SCENARIO_REQUEST,
  SAVE_SCENARIO_SUCCESS,
  SCENARIO_RESET,
  SET_SCENARIO_FILTER,
} from "../actions/scenariosActions";

const scenarios = (
  state = {
    isFetching: false,
    loadError: "",
    items: [],
    isSaving: false,
    saveError: "",
    saveSuccess: false,
    saveIssues: [],
    isDeleting: false,
    deleteError: "",
    deleteSuccess: false,
    formOpen: false,
    formDefaultValues: {
      name: "",
      desc: "",
      team: "",
      owner: "",
      incident: {},
      email: {},
      dashboard: false,
      crons: [],
      results: true,
    },
    filter: "",
  },
  action
) => {
  switch (action.type) {
    case LOAD_SCENARIOS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        loadError: "",
      });
    case LOAD_SCENARIOS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loadError: action.error,
      });
    case LOAD_SCENARIOS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.scenarios
          .filter(
            (scenario) => !action.scenarios.some((newScenario) => newScenario._id === scenario._id)
          )
          .concat(action.scenarios),
      });
    case SAVE_SCENARIO_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
        saveError: "",
        saveSuccess: false,
        saveIssues: [],
      });
    case SAVE_SCENARIO_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        saveError: action.error,
      });
    case SAVE_SCENARIO_ISSUES:
      return Object.assign({}, state, {
        isSaving: false,
        saveIssues: action.issues,
      });
    case SAVE_SCENARIO_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        saveSuccess: true,
        formOpen: false,
      });
    case DELETE_SCENARIO_REQUEST:
      return Object.assign({}, state, {
        isDeleting: true,
        deleteSuccess: false,
        deleteError: "",
      });
    case DELETE_SCENARIO_FAILURE:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteError: action.error,
      });
    case DELETE_SCENARIO_SUCCESS:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteSuccess: true,
        formOpen: false,
      });
    case SCENARIO_RESET:
      return Object.assign({}, state, {
        saveError: "",
        saveSuccess: false,
        deleteError: "",
        deleteSuccess: false,
      });
    case OPEN_SCENARIO_FORM:
      return Object.assign({}, state, {
        formOpen: true,
        formDefaultValues: action.values,
      });
    case CLOSE_SCENARIO_FORM:
      return Object.assign({}, state, {
        formOpen: false,
        saveError: "",
        deleteError: "",
      });
    case SET_SCENARIO_FILTER:
      return Object.assign({}, state, {
        filter: action.filter,
      });
    default:
      return state;
  }
};

export default scenarios;
