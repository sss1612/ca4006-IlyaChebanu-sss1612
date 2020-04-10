
// these arrays can be changed to objects or w/e to suit our needs
const initialState = {
  userIds: [],
  uploadedFiles: [],
  metaDataFiles: [],
  success: "naw"
};

export const TEST = `${__filename}/TEST`;
export const TEST_SUCCESS = `${__filename}/TEST_SUCCESS`;
export const TEST_ERROR = `${__filename}/TEST_ERROR`;
export const SET_INITIAL_STATE = `${__filename}/SET_INITIAL_STATE`;


// Selectors

const getSuccessSelector = state => state.userUpload.success;

export const selectors = {
  getSuccessSelector
}

export default function reducer(state=initialState, action) {
  switch (action.type) {

      case (TEST_SUCCESS): {
          const success = action.payload
          return {
              ...state,
              success,
          }
      }
      case (SET_INITIAL_STATE): {
        return action.payload;
      }

      default: {
          return state;
      }
  }
}

// Actions

export const actions = {
  test: testMessage => ({
      type: TEST,
      payload: testMessage
  }),
  testError: errorMessage => ({
      type: TEST_ERROR,
      payload: errorMessage
  }),
  testSuccess: successMessage => ({
      type: TEST_SUCCESS,
      payload: successMessage
  }),
  setInitialState: state => ({
    type: SET_INITIAL_STATE,
    payload: state,
  }),
}
