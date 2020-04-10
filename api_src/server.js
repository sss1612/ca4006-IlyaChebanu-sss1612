import "regenerator-runtime/runtime";
import express from "express";
import store from './store/store';
import uploadRouter from "./endpoints/upload";

import { actions as sharedStateActions } from "../shared/store/sharedState";

const app = express();

setTimeout(() => {
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
}, 1000);


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
