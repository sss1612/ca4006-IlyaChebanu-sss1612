import "regenerator-runtime/runtime";
import express from "express";
import workerThreadShite from './worker_thread';
import createSagaMiddleware from 'redux-saga';
import configureStore from "./store/configureStore";
import rootSaga from './store/rootSaga';
import uploadRouter from "./endpoints/upload";

import { actions as userUploadActions } from "../shared/store/userUpload";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore(sagaMiddleware);
sagaMiddleware.run(rootSaga)
const app = express();

const myworker = workerThreadShite(`console.log("lmao")`)

console.log("myworker", myworker);
setTimeout(() => {
    for (let i = 0; i < 10; i++) {
        store.dispatch(userUploadActions.test("dingus amingus"))
        store.dispatch(userUploadActions.test("dingus amingus"))
    }
}, 5000);
console.log("testing my logs lmao")

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
