import { parentPort } from 'worker_threads';

parentPort.once('message', data => {
  parentPort.postMessage(data + 1);
});
