
// these arrays can be changed to objects or w/e to suit our needs
const initialState = {
  processingQueue: [],
  processingError: null,
  uploadedFiles: [],
  metaData: {},
  outputFiles: [],
  wordsCompleted: 0,
  timePerWord: 0.001,
  fileWritingOverhead: 0,
};


export const ADD_TO_QUEUE = "sharedState/ADD_TO_QUEUE";
export const REMOVE_FROM_QUEUE = "sharedState/REMOVE_FROM_QUEUE";
export const SET_PROCESSING_ERROR = "sharedState/SET_PROCESSING_ERROR";
export const CLEAR_PROCESSING_ERROR = "sharedState/CLEAR_PROCESSING_ERROR";
export const NEW_FILE_ADDED = "sharedState/NEW_FILE_ADDED";
export const SET_INITIAL_STATE = "sharedState/SET_INITIAL_STATE";
export const ADD_NEW_FILENAME = "sharedState/ADD_NEW_FILENAME";
export const ADD_METADATA = "sharedState/ADD_METADATA";
export const SET_TASK_WORDS_COMPLETED = "sharedState/SET_TASK_WORDS_COMPLETED";
export const TIME_PER_WORD = "sharedState/TIME_PER_WORD";
export const FILE_WRITING_OVERHEAD = "sharedState/FILE_WRITING_OVERHEAD";


// Selectors

export const selectors = {
  getProcessingQueue: state => state.sharedState.processingQueue,
  getProcessingError: state => state.sharedState.processingError,
  getSuccessSelector: state => state.sharedState.success,
  getMetadataSelector: state => state.sharedState.metaData,
  getUploadedFiles: state => state.sharedState.uploadedFiles,
  getOutputFiles: state => state.sharedState.outputFiles,
  getWordsCompleted: state => state.sharedState.wordsCompleted,
  getTimePerWord: state => state.sharedState.timePerWord,
  getFileWritingOverhead: state => state.sharedState.fileWritingOverhead,
}


// Actions

export const actions = {
  addToQueue: payload => ({
    type: ADD_TO_QUEUE,
    payload: {
      filename: `${Math.random() * 10000 << 0}__${new Date().toISOString()}.txt`,
      ...payload,
    }
  }),
  removeFromQueue: filename => ({
    type: REMOVE_FROM_QUEUE,
    payload: filename,
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
  }),
  setTaskWordsCompleted: completedWords => ({
    type: SET_TASK_WORDS_COMPLETED,
    payload: completedWords,
  }),
  setTimePerWord: tpw => ({
    type: TIME_PER_WORD,
    payload: tpw,
  }),
  setFileWritingOverhead: msPerWord => ({
    type: FILE_WRITING_OVERHEAD,
    payload: msPerWord,
  }),
}


// Reducer

export default function reducer(state=initialState, { type, payload }) {
  switch (type) {
    case (ADD_TO_QUEUE): {
      return {
        ...state,
        processingQueue: [...state.processingQueue, {
          filename: payload.filename,
          totalWordCount: payload.totalWordCount,
          completedWords: 0
        }],
      };
    }
    case (SET_TASK_WORDS_COMPLETED): {
      return {
        ...state,
        wordsCompleted: payload,
      };
    }
    case (TIME_PER_WORD): {
      return {
        ...state,
        timePerWord: payload,
      };
    }
    case (FILE_WRITING_OVERHEAD): {
      return {
        ...state,
        fileWritingOverhead: payload,
      };
    }
    case (REMOVE_FROM_QUEUE): {
      return {
        ...state,
        processingQueue: state.processingQueue.filter(t => t.filename !== payload),
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
        uploadedFiles: [payload, ...state.uploadedFiles],
      };
    }
    case (NEW_FILE_ADDED): {
      return {
        ...state,
        outputFiles: [payload, ...state.outputFiles],
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
