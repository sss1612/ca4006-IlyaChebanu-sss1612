import "regenerator-runtime/runtime";
import express from "express";
import createSagaMiddleware from 'redux-saga';
import configureStore from "./store/configureStore";
import rootSaga from './store/rootSaga';
import uploadRouter from "./endpoints/upload";

import { actions as userUploadActions } from "./store/userUpload/userUpload";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore(sagaMiddleware);
sagaMiddleware.run(rootSaga)
const app = express();

store.dispatch(userUploadActions.test("dingus amingus"))
console.log("testing my logs lmao")

app.get("/", (req, res) => {
    res.send(`${Date.now()}`);
})
app.use(uploadRouter);

app.listen("8080", () => console.log("Please visit http:localhost:8080 in your browser!"));
