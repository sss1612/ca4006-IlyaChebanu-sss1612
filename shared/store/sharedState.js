
// these arrays can be changed to objects or w/e to suit our needs
const initialState = {
  simulateForcedFullDiskSpace: false,
  processingQueue: [],
  processingError: null,
  uploadedFiles: [],
  metaData: {},
  outputFiles: [],
  wordsCompleted: 0,
  timePerWord: 0.001,
  fileWritingOverhead: 0,
  uploadsFolderSize: 0,
  outputsFolderSize: 0,
  availableDiskSpace: process.env.DISK_LIMIT, // 80MB
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
export const REMOVE_UPLOADED_FILE = "sharedState/REMOVE_UPLOADED_FILE";
export const REMOVE_OUTPUT_FILE = "sharedState/REMOVE_OUTPUT_FILE";
export const SET_UPLOADS_FOLDER_SIZE = "sharedState/SET_UPLOADS_FOLDER_SIZE";
export const SET_OUTPUTS_FOLDER_SIZE = "sharedState/SET_OUTPUTS_FOLDER_SIZE";
export const SET_AVAILABLE_DISK_SPACE = "sharedState/SET_AVAILABLE_DISK_SPACE";
export const NOTIFY_USER_ERROR_MESSAGE = "sharedState/NOTIFY_USER_ERROR_MESSAGE";
export const FORCE_DISK_SPACE_FULL_SIMULATION = "sharedState/FORCE_DISK_SPACE_FULL_SIMULATION";

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
  getUsedStorage: state => state.sharedState.uploadsFolderSize + state.sharedState.outputsFolderSize,
  getAvailableDiskSpace: state => state.sharedState.availableDiskSpace,
  getForcedFullDiskSpaceIsTrue: state => state.sharedState.simulateForcedFullDiskSpace,
}


// Actions

export const actions = {
  addToQueue: payload => ({
    type: ADD_TO_QUEUE,
    payload,
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
  removeUploadedFile: filename => ({
    type: REMOVE_UPLOADED_FILE,
    payload: filename,
  }),
  removeOutputFile: filename => ({
    type: REMOVE_OUTPUT_FILE,
    payload: filename,
  }),
  setUploadsFolderSize: bytes => ({
    type: SET_UPLOADS_FOLDER_SIZE,
    payload: bytes,
  }),
  setOutputsFolderSize: bytes => ({
    type: SET_OUTPUTS_FOLDER_SIZE,
    payload: bytes,
  }),
  setAvailableDiskSpace: bytes => ({
    type: SET_AVAILABLE_DISK_SPACE,
    payload: bytes,
  }),
  notifyUserErrorMessage: errorMessage => ({
    type: NOTIFY_USER_ERROR_MESSAGE,
    errorMessage
  }),
  simulateForcedDiskSpace: flag => ({
    type: FORCE_DISK_SPACE_FULL_SIMULATION,
    payload: flag,
  })
}


// Reducer

export default function reducer(state=initialState, { type, payload }) {
  // (state.sharedState.availableDiskSpace)
  switch (type) {
    case (REMOVE_UPLOADED_FILE): {
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter(f => f !== payload),
      };
    }
    case (REMOVE_OUTPUT_FILE): {
      return {
        ...state,
        outputFiles: state.outputFiles.filter(f => f !== payload),
      };
    }
    case (SET_UPLOADS_FOLDER_SIZE): {
      return {
        ...state,
        uploadsFolderSize: payload,
      };
    }
    case (SET_OUTPUTS_FOLDER_SIZE): {
      return {
        ...state,
        outputsFolderSize: payload,
      };
    }
    case (SET_AVAILABLE_DISK_SPACE): {
      return {
        ...state,
        availableDiskSpace: payload,
      };
    }
    case (ADD_TO_QUEUE): {
      return {
        ...state,
        processingQueue: [...state.processingQueue, {
          ...payload,
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

    case(FORCE_DISK_SPACE_FULL_SIMULATION): {
      const flag = payload;
      return {
        ...state,
        simulateForcedFullDiskSpace: flag
      }
    }
    default: {
      return state;
    }
  }
}
