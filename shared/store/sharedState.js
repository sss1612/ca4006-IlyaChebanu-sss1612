
// these arrays can be changed to objects or w/e to suit our needs
const initialState = {
  processingQueue: [],
  processingError: null,
};

export const ADD_TO_QUEUE = `${__filename}/ADD_TO_QUEUE`;
export const REMOVE_FROM_QUEUE = `${__filename}/REMOVE_FROM_QUEUE`;
export const SET_PROCESSING_ERROR = `${__filename}/SET_PROCESSING_ERROR`;
export const CLEAR_PROCESSING_ERROR = `${__filename}/CLEAR_PROCESSING_ERROR`;
export const NEW_FILE_ADDED = `${__filename}/NEW_FILE_ADDED`;
export const SET_INITIAL_STATE = `${__filename}/SET_INITIAL_STATE`;


// Selectors

export const selectors = {
  getProcessingQueue: state => state.sharedState.processingQueue,
  getProcessingError: state => state.sharedState.processingError,
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
    default: {
      return state;
    }
  }
}
