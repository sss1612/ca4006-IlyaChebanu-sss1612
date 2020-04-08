
// these arrays can be changed to objects or w/e to suit our needs
const initialState = {
  userIds: [],
  uploadedFiles: [],
  metaDataFiles: [],
  success: "naw"
};

export const TEST = "userUpload/TEST";
export const TEST_SUCCESS = "userUpload/TEST_SUCCESS";
export const TEST_ERROR = "userUpload/TEST_ERROR";


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
}
