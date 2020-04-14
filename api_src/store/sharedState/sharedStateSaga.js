import { all, call, put, takeEvery, select } from 'redux-saga/effects'
import fs from "fs";
import {
  actions as sharedStateActions,
  selectors as sharedStateSelectors,
  ADD_TO_QUEUE,
  REMOVE_FROM_QUEUE,
  FORCE_DISK_SPACE_FULL_SIMULATION
}
from "../../../shared/store/sharedState";
import store from '../store';
import { Worker } from 'worker_threads';
import KalmanFilter from 'kalmanjs';
import checkDiskSpace from 'check-disk-space';

const slash = process.platform === "win32"
?  "\\"
: "/"
const flagPathName = `${__dirname.split(`${slash}api_dist`)[0]}${slash}flag.txt`;

const timePerWordKalman = new KalmanFilter({ R: 1, Q: 1 });
const fileWritingOverheadKalman = new KalmanFilter({ R: 1, Q: 1 });

let outputWorker;
let processingTaskFilename;
let processing = false;

const processChunk = (chunk) => new Promise((resolve, reject) => {
  outputWorker = new Worker(`${__dirname}/outputGenerator.worker.js`);
  let lastTime = new Date().getTime();
  outputWorker.on('message', (data) => {
    if(data.error) {
      store.dispatch(sharedStateActions.notifyUserErrorMessage(data.error))
      return;
    }
    const currentTime = new Date().getTime();
    // Update progress on redux every 250 ms or so
    if (currentTime - lastTime > 100 || data.shuffled) {
      store.dispatch(sharedStateActions.setTaskWordsCompleted(data.words));
      if (data.tpw) {
        store.dispatch(sharedStateActions.setTimePerWord(timePerWordKalman.filter(data.tpw)));
      }
      lastTime = currentTime;
    }
    if (data.completed) {
      store.dispatch(sharedStateActions.setTaskWordsCompleted(0));
      store.dispatch(sharedStateActions.setFileWritingOverhead(
        fileWritingOverheadKalman.filter(data.fileWritingOverhead)
      ));
      resolve(true);
    }
  });
  outputWorker.on('error', error => {
    reject(error);
  });
  outputWorker.on('exit', (code) => {
    resolve();
  });
  outputWorker.postMessage(chunk);
});

const cancelChunkProcessing = async () => {
  await outputWorker.terminate();
}

const processQueue = async (lastTask = null) => {
  processing = true;
  const processingQueue = sharedStateSelectors.getProcessingQueue(store.getState());
  const metadata = sharedStateSelectors.getMetadataSelector(store.getState());

  if (!processingQueue.length) {
    processing = false;
    return;
  }

  let task = processingQueue[0];
  /*
    Necessary because removeFromQueue action is asynchronous and so the store
    might not have updated by the time this gets called recursively
  */
  if (task.filename === lastTask) {
    if (processingQueue.length > 1) {
      task = processingQueue[1];
    } else {
      processing = false;
      return;
    }
  }

  try {
    processingTaskFilename = task.filename;
    const chunk = metadata[task.originalFilename][task.chunk];
    const completed = await processChunk({ ...chunk, filename: task.filename, softLimit: process.env.DISK_LIMIT });
    processingTaskFilename = null;

    if (completed) {
      store.dispatch(sharedStateActions.removeFromQueue(task.filename));
    }

    processQueue(task.filename);
  } catch (error) {
    console.error(error);
    store.dispatch(sharedStateActions.setProcessingError(error.message));
  }
};


function* addToQueueSaga({ payload }) {
  try {
    if (processing) return;
    processQueue();
  } catch (error) {
    console.error(error);
    yield put(sharedStateActions.setProcessingError(error.message));
  }
}

function* removeFromQueueSaga({ type, payload }) {
  try {
    if (payload === processingTaskFilename) {
      yield call(cancelChunkProcessing);
    }
  } catch (error) {
    console.error(error);
    yield put(sharedStateActions.setProcessingError(error.message));
  }
}

function* fullDiskSimulatorSaga() {
  const flag = yield select(sharedStateSelectors.getForcedFullDiskSpaceIsTrue);
  fs.writeFileSync(flagPathName, `${flag}`);
  if (flag) {
    yield put(sharedStateActions.setAvailableDiskSpace(process.env.DISK_LIMIT));
  } else {
    const { free } = yield checkDiskSpace(process.platform === "win32" ? 'C:/' : '/');
    yield put(sharedStateActions.setAvailableDiskSpace(free));
  }
}

function* addToQueueWatcher() {
  yield takeEvery(ADD_TO_QUEUE, addToQueueSaga);
}

function* removeFromQueueWatcher() {
  yield takeEvery(REMOVE_FROM_QUEUE, removeFromQueueSaga);
}

function* fullDiskSimulatorSagaWatcher() {
  yield takeEvery(FORCE_DISK_SPACE_FULL_SIMULATION, fullDiskSimulatorSaga)
}

export default function* rootUserUploadSaga() {
  yield all([
    call(addToQueueWatcher),
    call(removeFromQueueWatcher),
    call(fullDiskSimulatorSagaWatcher)
  ])
}
