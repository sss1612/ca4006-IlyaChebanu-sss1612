import { all, call, put, takeEvery } from 'redux-saga/effects'
import {
  actions as sharedStateActions,
  ADD_TO_QUEUE,
  REMOVE_FROM_QUEUE,
}
from "../../../shared/store/sharedState";
import store from '../store';
import { Worker } from 'worker_threads';

let outputWorker;
let processingTaskId;
let processing = false;

const processChunk = (chunk) => new Promise((resolve, reject) => {
  outputWorker = new Worker(`${__dirname}/outputGenerator.worker.js`);
  outputWorker.once('message', (filename) => {
    resolve(filename);
  });
  outputWorker.once('error', error => {
    reject(error);
  });
  outputWorker.once('exit', (code) => {
    resolve();
  });
  outputWorker.postMessage(chunk);
});

const cancelChunkProcessing = async () => {
  await outputWorker.terminate();
}

const processQueue = async (lastTaskId = null) => {
  processing = true;
  const latestSharedState = store.getState().sharedState;

  if (!latestSharedState.processingQueue.length) {
    processing = false;
    return;
  }

  let task = latestSharedState.processingQueue[0];
  /*
    Necessary because removeFromQueue action is asynchronous and so the store
    might not have updated by the time this gets called recursively
  */
  if (task.taskId === lastTaskId) {
    if (latestSharedState.processingQueue.length > 1) {
      task = latestSharedState.processingQueue[1];
    } else {
      processing = false;
      return;
    }
  }

  try {
    processingTaskId = task.taskId;
    const filename = await processChunk(task);
    processingTaskId = null;

    if (filename) {
      console.log('filename', filename);
      store.dispatch(sharedStateActions.removeFromQueue(task.taskId));
      store.dispatch(sharedStateActions.newFileAdded(filename));
    } else {
      console.log('cancelled task');
    }

    processQueue(task.taskId);
  } catch (error) {
    store.dispatch(sharedStateActions.setProcessingError(error));
  }
};


function* addToQueueSaga() {
  try {
    if (processing) return;
    processQueue();
  } catch (error) {
    yield put(sharedStateActions.setProcessingError(error));
  }
}

function* removeFromQueueSaga({ type, payload }) {
  try {
    if (payload === processingTaskId) {
      yield call(cancelChunkProcessing);
    }
  } catch (error) {
    yield put(sharedStateActions.setProcessingError(error));
  }
}

function* addToQueueWatcher() {
  yield takeEvery(ADD_TO_QUEUE, addToQueueSaga);
}

function* removeFromQueueWatcher() {
  yield takeEvery(REMOVE_FROM_QUEUE, removeFromQueueSaga);
}

export default function* rootUserUploadSaga() {
  yield all([
    call(addToQueueWatcher),
    call(removeFromQueueWatcher),
  ])
}
