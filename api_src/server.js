import "regenerator-runtime/runtime";
import express from "express";
import store from './store/store';
import uploadRouter from "./endpoints/upload";

import { actions as userUploadActions } from "../shared/store/userUpload";
import { actions as sharedStateActions } from "../shared/store/sharedState";

import { Worker } from 'worker_threads';

const app = express();

store.dispatch(sharedStateActions.addToQueue({
    filter: 'a-c',
    wordsCount: {
        anxious: 168,
        bacon: 168,
        collaborative: 168,
        columns: 168,
        consumed: 168,
    },
    taskId: 69,
}));
store.dispatch(sharedStateActions.removeFromQueue(69));
store.dispatch(sharedStateActions.addToQueue({
    filter: 'a-c',
    wordsCount: {
        anxious: 168,
        bacon: 168,
        collaborative: 168,
        columns: 168,
        consumed: 168,
    }
}));

const asyncWrappedWorker = (data, path) => new Promise((resolve, reject) => {
    const worker = new Worker(path);
    worker.once('message', result => {
        resolve(result);
    });
    worker.once('error', error => {
        reject(error);
    });
    worker.postMessage(data);
});

// asyncWrappedWorker(68, `${__dirname}/plusOneWorker.js`)
//     .then(data => console.log(data))
//     .catch(error => console.error(error));

// setTimeout(() => {
//     for (let i = 0; i < 10; i++) {
//         store.dispatch(userUploadActions.test("dingus amingus"))
//         store.dispatch(userUploadActions.test("dingus amingus"))
//     }
// }, 5000);
// console.log("testing my logs lmao")

app.get("/", (req, res) => {
    res.send(store.getState());
})

app.get("/add/:id", (req, res) => {
    const { params: { id } } = req;
    console.log("id --> ", id);
    res.send(`${Date.now()} - I got your req which was ${id}`)
})

app.get("/remove/:id", (req, res) => {
    const { params: { id } } = req;
    console.log("id --> ", id);
    res.send(`${Date.now()} - I got your req which was ${id}`)
})

app.use(uploadRouter);

app.listen("8080", () => console.log("Please visit http://localhost:8080 in your browser!"));
