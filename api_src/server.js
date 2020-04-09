import "regenerator-runtime/runtime";
import express from "express";
import createSagaMiddleware from 'redux-saga';
import configureStore from "./store/configureStore";
import rootSaga from './store/rootSaga';
import uploadRouter from "./endpoints/upload";

import { actions as userUploadActions } from "../shared/store/userUpload";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore(sagaMiddleware);
sagaMiddleware.run(rootSaga)
const app = express();

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
app.use(uploadRouter);

app.listen("8080", () => console.log("Please visit http://localhost:8080 in your browser!"));
