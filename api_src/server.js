import fs from "fs";
import "regenerator-runtime/runtime";
import express from "express";
import store from './store/store';
import uploadRouter from "./endpoints/upload";
import filterRouter from "./endpoints/filter";
import processingRouter from "./endpoints/processing";
import deleterRouter from "./endpoints/deleter";
import getFileRouter from "./endpoints/getFile";
import outputFilesizeTrackerRouter from "./endpoints/outputFilesizeTracker";
import bodyParser from "body-parser";
import chokidar from 'chokidar';
import path from 'path';
import fsUtil from 'nodejs-fs-utils';
import checkDiskSpace from 'check-disk-space';

import { actions as sharedStateActions } from "../shared/store/sharedState";


const slash = process.platform === "win32"
    ?  "\\"
    : "/"
const uploadPath = `${__dirname.split(`${slash}api_dist`)[0]}${slash}uploads`;

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const outputPath = `${__dirname.split(`${slash}api_dist`)[0]}${slash}output_files`;
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

const uploadWatcher = chokidar.watch(uploadPath, { ignored: /^\./, persistent: true });
uploadWatcher.on('add', p => {
    store.dispatch(sharedStateActions.addNewFilename(path.basename(p)));
    setTimeout(() => {
        fsUtil.fsize(path.dirname(p), async (err, size) => {
            if (err) return console.error(err);
            store.dispatch(sharedStateActions.setUploadsFolderSize(size));
            try {
                const { available } = await checkDiskSpace(process.platform === "win32" ? 'c:' : '/');
                store.dispatch(sharedStateActions.setAvailableDiskSpace(available));
            } catch (e) {
                //
            }
        });
    }, 500); // Needs a bit of time to catch up on the file system
});
uploadWatcher.on('unlink', p => {
    store.dispatch(sharedStateActions.removeUploadedFile(path.basename(p)));
    fsUtil.fsize(path.dirname(p), async (err, size) => {
        if (err) return console.error(err);
        store.dispatch(sharedStateActions.setUploadsFolderSize(size));
        try {
            const { available } = await checkDiskSpace(process.platform === "win32" ? 'c:' : '/');
            store.dispatch(sharedStateActions.setAvailableDiskSpace(available));
        } catch (e) {
            //
        }
    });
});

const outputWatcher = chokidar.watch(outputPath, { ignored: /^\./, persistent: true });
outputWatcher.on('add', p => {
    store.dispatch(sharedStateActions.newFileAdded(path.basename(p)));
    setTimeout(() => {
        fsUtil.fsize(path.dirname(p), async (err, size) => {
            if (err) return console.error(err);
            store.dispatch(sharedStateActions.setOutputsFolderSize(size));
            try {
                const { available } = await checkDiskSpace(process.platform === "win32" ? 'c:' : '/');
                store.dispatch(sharedStateActions.setAvailableDiskSpace(available));
            } catch (e) {
                //
            }
        });
    }, 500);
});
outputWatcher.on('unlink', p => {
    store.dispatch(sharedStateActions.removeOutputFile(path.basename(p)));
    fsUtil.fsize(path.dirname(p), async (err, size) => {
        if (err) return console.error(err);
        store.dispatch(sharedStateActions.setOutputsFolderSize(size));
            try {
                const { available } = await checkDiskSpace(process.platform === "win32" ? 'c:' : '/');
                store.dispatch(sharedStateActions.setAvailableDiskSpace(available));
            } catch (e) {
                //
            }
    });
});



const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use(bodyParser.json());

app.use('/static', express.static('output_files'))

app.get("/", (req, res) => {
    res.send(store.getState());
});

app.use("/app", express.static("build"))
app.use(uploadRouter);
app.use(filterRouter);
app.use(processingRouter);
app.use(deleterRouter);
app.use(getFileRouter);
app.use(outputFilesizeTrackerRouter);
app.listen("8080", () => console.log("Please visit http://localhost:8080 in your browser!"));

