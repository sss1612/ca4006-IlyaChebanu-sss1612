import { all, call, put, takeEvery } from 'redux-saga/effects'
import {
  actions as sharedStateActions,
  ADD_TO_QUEUE,
}
from "../../../shared/store/sharedState";
import store from '../store';
import { Worker } from 'worker_threads';

let outputWorker = new Worker(`${__dirname}/outputGenerator.worker.js`);

const processChunk = (chunk) => new Promise((resolve, reject) => {
  outputWorker.once('message', (filename) => {
    resolve(filename);
  });
  outputWorker.once('error', error => {
    reject(error);
  });
  outputWorker.once('exit', () => {
    resolve();
  });
  outputWorker.postMessage(chunk);
});

const cancelChunkProcessing = async () => {
  await outputWorker.terminate();
  outputWorker = new Worker(`${__dirname}/outputGenerator.worker.js`);
}

function* addToQueueSaga() {
  try {
    const { sharedState } = store.getState();
    console.log(sharedState);

    if (sharedState.processingQueue.length > 1) {
      // Means processing must be running already
      return;
    }

    const processQueue = async (lastTaskId = null) => {
      const latestSharedState = store.getState().sharedState;

      if (!latestSharedState.processingQueue.length) return;

      let task = latestSharedState.processingQueue[0];
      /*
        Necessary because removeFromQueue action is asynchronous and so the store
        might not have updated by the time this gets called recursively
      */
      if (task.taskId === lastTaskId) {
        if (latestSharedState.processingQueue.length > 1) {
          task = latestSharedState.processingQueue[1];
        } else {
          return;
        }
      }

      try {
        const filename = await processChunk(task);
        if (filename) {
          console.log('filename', filename);
        } else {
          console.log('cancelled task');
        }
        store.dispatch(sharedStateActions.removeFromQueue(task.taskId));
        processQueue(task.taskId);
      } catch (error) {
        store.dispatch(sharedStateActions.setProcessingError(error));
      }
    };
    processQueue();
  } catch (error) {
    yield put(sharedStateActions.setProcessingError(error));
  }
}

function* addToQueueWatcher() {
  yield takeEvery(ADD_TO_QUEUE, addToQueueSaga);
}

export default function* rootUserUploadSaga() {
  yield all([
    call(addToQueueWatcher),
  ])
}
