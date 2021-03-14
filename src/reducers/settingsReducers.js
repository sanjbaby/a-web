import {
  LOAD_SETTINGS_FAILURE,
  LOAD_SETTINGS_REQUEST,
  LOAD_SETTINGS_SUCCESS,
  SAVE_SETTINGS_FAILURE,
  SAVE_SETTINGS_REQUEST,
  SAVE_SETTINGS_SUCCESS,
  SET_TEAM_FILTER,
} from "../actions/settingsActions";

const settings = (
  state = {
    isFetching: false,
    loadError: "",

    settings: {
      connections: {
        types: [],
        envs: [],
      },
      teams: [],
      repos: [],
      metadata: {
        areas: "",
        systems: "",
        categories: "",
        types: "",
        cadences: "",
        breakdowns: "",
      },
    },
    isSaving: false,
    saveError: "",
    filter: [],
  },
  action
) => {
  switch (action.type) {
    case LOAD_SETTINGS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        loadError: "",
      });
    case LOAD_SETTINGS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loadError: action.error,
      });
    case LOAD_SETTINGS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        settings: action.settings.settings,
      });
    case SAVE_SETTINGS_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
        saveError: "",
      });
    case SAVE_SETTINGS_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        loadError: action.error,
      });
    case SAVE_SETTINGS_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
      });
    case SET_TEAM_FILTER:
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

export default settings;
