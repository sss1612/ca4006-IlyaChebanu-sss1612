// these arrays can be changed to objects or w/e to suit our needs
const initialState = {
  userIds: [],
  uploadedFiles: {},
  metaData: {},
  success: "naw"
};

export const TEST = "userUpload/TEST";
export const TEST_SUCCESS = "userUpload/TEST_SUCCESS";
export const TEST_ERROR = "userUpload/TEST_ERROR";
export const ADD_NEW_FILENAME = "userUpload/ADD_NEW_FILENAME";
export const ADD_METADATA = "userUpload/ADD_METADATA"

// Selectors

const getSuccessSelector = state => state.userUpload.success;
const getMetadataSelector = (state) => state.userUpload.metaData;
export const selectors = {
  getSuccessSelector
}

export default function reducer(state=initialState, action) {
  console.log("action", action, "\n--->\n", JSON.stringify(state, null, 2), "\n\n");
  switch (action.type) {

      case (TEST_SUCCESS): {
          const success = action.payload
          return {
              ...state,
              success,
          }
      }

      case (ADD_NEW_FILENAME): {
        const { payload: filename } = action;
        return {
          ...state,
          uploadedFiles: {
            ...state.uploadedFiles,
            [filename]: true,
          }
        };
      }

      case (ADD_METADATA): {
        const { filename, stats, filter } = action.payload
        const metaDataFilenamePropExists = filename in getMetadataSelector({ userUpload: state });

        if (!metaDataFilenamePropExists) {
          return {
            ...state,
            metaData: {
              ...state.metaData,
              [filename]: {
                [filter]: {
                  filter,
                  ...stats
                },
              }
            }
          }
        }
        return {
          ...state,
          metaData: {
            ...state.metaData,
            [filename]: {
              ...state.metaData[filename],
              [filter]: {
                ...stats,
              }
            }
          }
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
  addNewFilename: filename => ({
    type: ADD_NEW_FILENAME,
    payload: filename,
  }),
  addMetadata: chunkStats => ({
    type: ADD_METADATA,
    payload: chunkStats,
  })
}
