import { Worker } from 'worker_threads';


const spawnWorker = (data, path) => new Promise((resolve, reject) => {
    const worker = new Worker(path);
    worker.once('message', result => {
        resolve(result);
    });
    worker.once('error', error => {
        reject(error);
    });
    worker.postMessage(data);
});

export default spawnWorker;
