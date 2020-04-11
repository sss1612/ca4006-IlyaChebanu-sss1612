import fs from "fs";
import "regenerator-runtime/runtime";
import express from "express";
import store from './store/store';
import uploadRouter from "./endpoints/upload";
import filterRouter from "./endpoints/filter";
import processingRouter from "./endpoints/processing";
import bodyParser from "body-parser";

import { actions as sharedStateActions } from "../shared/store/sharedState";

const slash = process.platform === "win32"
    ?  "\\"
    : "/"
const uploadPath = `${__dirname.split(`${slash}api_dist`)[0]}${slash}uploads`;

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
outFiles.sort((a, b) => {
    const dateA = a.split('__')[1].slice(0, -4);
    const dateB = b.split('__')[1].slice(0, -4);
    return (new Date(dateA).getTime() - new Date(dateB).getTime());
});
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

app.listen("8080", () => console.log("Please visit http://localhost:8080 in your browser!"));

