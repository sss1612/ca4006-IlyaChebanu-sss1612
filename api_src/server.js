import fs from "fs";
import "regenerator-runtime/runtime";
import express from "express";
import store from './store/store';
import uploadRouter from "./endpoints/upload";
import filterRouter from "./endpoints/filter";
import processingRouter from "./endpoints/processing";
import deleterRouter from "./endpoints/deleter";
import bodyParser from "body-parser";

import { actions as sharedStateActions } from "../shared/store/sharedState";


const uploadPath = `${__dirname.split("/api_dist")[0]}/uploads`;

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}
const files = fs.readdirSync(uploadPath);
files.forEach(file => {
    store.dispatch(sharedStateActions.addNewFilename(file));
});

const outputPath = `${__dirname.split("/api_dist")[0]}/output_files`;

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}
const outFiles = fs.readdirSync(outputPath);
outFiles.forEach(file => {
    store.dispatch(sharedStateActions.newFileAdded(file));
});



const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send(store.getState());
});

app.use(uploadRouter);
app.use(filterRouter);
app.use(processingRouter);
app.use(deleterRouter);

app.listen("8080", () => console.log("Please visit http://localhost:8080 in your browser!"));

