import fs from "fs";
import "regenerator-runtime/runtime";
import express from "express";
import store from './store/store';
import uploadRouter from "./endpoints/upload";
import filterRouter from "./endpoints/filter";

import { actions as userUploadActions } from "../shared/store/userUpload";
import { actions as sharedStateActions } from "../shared/store/sharedState";


const uploadPath = `${__dirname.split("/api_dist")[0]}/uploads`;

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}
const files = fs.readdirSync(uploadPath);
files.forEach(file => {
    store.dispatch(userUploadActions.addNewFilename(file));
});


const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get("/", (req, res) => {
    res.send(store.getState());
});

app.use(uploadRouter);
app.use(filterRouter);

app.listen("8080", () => console.log("Please visit http://localhost:8080 in your browser!"));


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
