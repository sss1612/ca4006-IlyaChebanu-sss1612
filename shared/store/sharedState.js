
// these arrays can be changed to objects or w/e to suit our needs
const initialState = {
  processingQueue: [],
  processingError: null,
};

export const ADD_TO_QUEUE = "sharedState/ADD_TO_QUEUE";
export const REMOVE_FROM_QUEUE = "sharedState/REMOVE_FROM_QUEUE";
export const SET_PROCESSING_ERROR = "sharedState/SET_PROCESSING_ERROR";
export const CLEAR_PROCESSING_ERROR = "sharedState/CLEAR_PROCESSING_ERROR";


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
      ...payload,
      taskId: Math.floor(Math.random() * 1000000),
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
    default: {
      return state;
    }
  }
}
