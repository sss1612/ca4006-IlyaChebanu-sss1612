const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
let parseJSAsync;

if (isMainThread) {
  parseJSAsync = (script) => {
    const worker = new Worker(__filename, {
        workerData: {script}
    });
    
    worker.on('message', (message) => {
        console.log(`tf is going on >${message}<`);
    });
    
    worker.on('error', console.log);
    
    worker.on('exit', (code) => {
        if (code !== 0) {
            console.log(new Error(`Worker stopped with exit code ${code}`));
        }
    });
  };
} else {
//   const { parse } = require('some-js-parsing-library');
  const { script } = workerData;
  console.log("script", script)
  parentPort.once("once", (message) => {
      console.log("git og tthis fuckign message", message)
  })
  parentPort.postMessage(script);
  parentPort.postMessage("fuckign stupid bitch")
}
export default parseJSAsync;
