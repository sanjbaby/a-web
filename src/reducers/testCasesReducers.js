import {
  CLOSE_TEST_CASE_FORM,
  DELETE_TEST_CASE_FAILURE,
  DELETE_TEST_CASE_REQUEST,
  DELETE_TEST_CASE_SUCCESS,
  TEST_CASE_RESET,
  LOAD_TEST_CASES_FAILURE,
  LOAD_TEST_CASES_REQUEST,
  LOAD_TEST_CASES_SUCCESS,
  NEW_TEST_CASES_ORDER,
  OPEN_TEST_CASE_FORM,
  SAVE_TEST_CASE_FAILURE,
  SAVE_TEST_CASE_REQUEST,
  SAVE_TEST_CASE_SUCCESS,
  SET_TEST_CASE_FILTER,
  TOGGLE_TEST_CASE_ENABLED,
} from "../actions/testCasesActions";

const testCases = (
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
    case LOAD_TEST_CASES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        loadError: "",
      });
    case LOAD_TEST_CASES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loadError: action.error,
      });
    case LOAD_TEST_CASES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.testCases,
        hasOrderChanged: false,
      });
    case SAVE_TEST_CASE_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
        saveError: "",
        saveSuccess: false,
      });
    case SAVE_TEST_CASE_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        saveError: action.error,
      });
    case SAVE_TEST_CASE_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        saveSuccess: true,
        formOpen: false,
      });
    case DELETE_TEST_CASE_REQUEST:
      return Object.assign({}, state, {
        isDeleting: true,
        deleteSuccess: false,
        deleteError: "",
      });
    case DELETE_TEST_CASE_FAILURE:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteError: action.error,
      });
    case DELETE_TEST_CASE_SUCCESS:
      return Object.assign({}, state, {
        isDeleting: false,
        deleteSuccess: true,
        formOpen: false,
      });
    case TEST_CASE_RESET:
      return Object.assign({}, state, {
        saveError: "",
        saveSuccess: false,
        deleteError: "",
        deleteSuccess: false,
      });
    case NEW_TEST_CASES_ORDER:
      return Object.assign({}, state, {
        items: action.testCases,
        hasOrderChanged: true,
      });
    case OPEN_TEST_CASE_FORM:
      return Object.assign({}, state, {
        formOpen: true,
        formDefaultValues: action.defaultValues,
      });
    case CLOSE_TEST_CASE_FORM:
      return Object.assign({}, state, {
        formOpen: false,
        saveError: "",
        deleteError: "",
      });
    case TOGGLE_TEST_CASE_ENABLED:
      return Object.assign({}, state, {
        items: state.items.map((testCase) =>
          testCase._id === action.id ? { ...testCase, enabled: !testCase.enabled } : testCase
        ),
        hasOrderChanged: true,
      });
    case SET_TEST_CASE_FILTER:
      return Object.assign({}, state, {
        filter: action.filter,
      });
    default:
      return state;
  }
};

export default testCases;
