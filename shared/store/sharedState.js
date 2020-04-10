
// these arrays can be changed to objects or w/e to suit our needs
const initialState = {
  processingQueue: [],
  processingError: null,
  uploadedFiles: {},
  metaData: {},
};


export const ADD_TO_QUEUE = "sharedState/ADD_TO_QUEUE";
export const REMOVE_FROM_QUEUE = "sharedState/REMOVE_FROM_QUEUE";
export const SET_PROCESSING_ERROR = "sharedState/SET_PROCESSING_ERROR";
export const CLEAR_PROCESSING_ERROR = "sharedState/CLEAR_PROCESSING_ERROR";
export const NEW_FILE_ADDED = "sharedState/NEW_FILE_ADDED";
export const SET_INITIAL_STATE = "sharedState/SET_INITIAL_STATE";
export const ADD_NEW_FILENAME = "sharedState/ADD_NEW_FILENAME";
export const ADD_METADATA = "sharedState/ADD_METADATA"


// Selectors

export const selectors = {
  getProcessingQueue: state => state.sharedState.processingQueue,
  getProcessingError: state => state.sharedState.processingError,
  getSuccessSelector: state => state.sharedState.success,
  getMetadataSelector: state => state.sharedState.metaData,
  getUploadedFiles: state => Object.keys(state.sharedState.uploadedFiles),
}


// Actions

export const actions = {
  addToQueue: payload => ({
    type: ADD_TO_QUEUE,
    payload: {
      taskId: Math.floor(Math.random() * 1000000),
      ...payload,
    }
  }),
  removeFromQueue: taskId => ({
    type: REMOVE_FROM_QUEUE,
    payload: taskId,
  }),
  setProcessingError: payload => ({
    type: SET_PROCESSING_ERROR,
    payload
  }),
  clearProcessingError: () => ({
    type: CLEAR_PROCESSING_ERROR
  }),
  newFileAdded: (filename) => ({
    type: NEW_FILE_ADDED,
    payload: filename,
  }),
  setInitialState: (state) => ({
    type: SET_INITIAL_STATE,
    payload: state,
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


// Reducer

export default function reducer(state=initialState, { type, payload }) {
  switch (type) {
    case (ADD_TO_QUEUE): {
      return {
        ...state,
        processingQueue: [...state.processingQueue, payload],
      };
    }
    case (REMOVE_FROM_QUEUE): {
      return {
        ...state,
        processingQueue: state.processingQueue.filter(t => t.taskId !== payload),
      };
    }
    case (SET_PROCESSING_ERROR): {
      return {
        ...state,
        processingError: payload,
      };
    }
    case (CLEAR_PROCESSING_ERROR): {
      return {
        ...state,
        processingError: null,
      };
    }
    case (SET_INITIAL_STATE): {
      return payload;
    }
    case (ADD_NEW_FILENAME): {
      return {
        ...state,
        uploadedFiles: {
          ...state.uploadedFiles,
          [payload]: true,
        }
      };
    }
    case (ADD_METADATA): {
      const { filename, stats, filter } = payload
      const metaDataFilenamePropExists = filename in selectors.getMetadataSelector({ sharedState: state });

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
