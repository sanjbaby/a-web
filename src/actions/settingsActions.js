import api from "../api";

export const LOAD_SETTINGS_REQUEST = "LOAD_SETTINGS_REQUEST";
export const loadSettingsRequest = () => {
  return {
    type: LOAD_SETTINGS_REQUEST,
  };
};

export const LOAD_SETTINGS_FAILURE = "LOAD_SETTINGS_FAILURE";
export const loadSettingsFailure = (error) => {
  return {
    type: LOAD_SETTINGS_FAILURE,
    error,
  };
};

export const LOAD_SETTINGS_SUCCESS = "LOAD_SETTINGS_SUCCESS";
export const loadSettingsSuccess = (settings) => {
  return {
    type: LOAD_SETTINGS_SUCCESS,
    settings,
  };
};

export const loadSettings = () => {
  return (dispatch) => {
    dispatch(loadSettingsRequest());

    api
      .get("/settings/basic")
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        return response.data;
      })
      .then((items) => {
        if (items.length < 1) {
          throw Error("Missing configuration.");
        }
        return items;
      })
      .then((data) => dispatch(loadSettingsSuccess(data)))
      .catch((error) => {
        dispatch(loadSettingsFailure(error.message));
      });
  };
};

export const SAVE_SETTINGS_REQUEST = "SAVE_SETTINGS_REQUEST";
export const saveSettingsRequest = () => {
  return {
    type: SAVE_SETTINGS_REQUEST,
  };
};

export const SAVE_SETTINGS_SUCCESS = "SAVE_SETTINGS_SUCCESS";
export const saveSettingsSuccess = () => {
  return {
    type: SAVE_SETTINGS_SUCCESS,
  };
};

export const SAVE_SETTINGS_FAILURE = "SAVE_SETTINGS_FAILURE";
export const saveSettingsFailure = (error) => {
  return {
    type: SAVE_SETTINGS_FAILURE,
    error,
  };
};

export const saveSettings = (option) => {
  return (dispatch) => {
    dispatch(saveSettingsRequest());

    api
      .post("/settings", option)
      .then((response) => {
        if (response.status !== 201) {
          throw Error(response.statusText);
        }
        dispatch(saveSettingsSuccess());
      })
      .catch((error) => {
        dispatch(saveSettingsFailure(error));
      });
  };
};

export const SET_TEAM_FILTER = "SET_TEAM_FILTER";
export const setTeamFilter = (filter) => {
  return {
    type: SET_TEAM_FILTER,
    filter,
  };
};
