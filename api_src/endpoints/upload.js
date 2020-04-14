import express from "express";
import multer from "multer";
import * as fs from "fs";
import store from "../store/store";
import { actions as sharedStateActions,
    selectors as sharedStateSelectors } from "./../../shared/store/sharedState";

var rejectUploads = false;

const router = express.Router()
const slash = process.platform === "win32"
    ?  "\\"
    : "/"
const uploadPath = `${__dirname.split(`${slash}api_dist`)[0]}${slash}uploads`;
const storage = multer.memoryStorage()
const upload = multer({ storage: storage }).single("recfile");

router.use(upload)

router.post("/upload", (req, res) => {
    const {
        originalname: filename,
        buffer,
        size: uploadFileSize,
    } = req.file;

    const filePathname = `${uploadPath}/${filename}`
    const state = store.getState();
    const baseAvailableDiskSpace = sharedStateSelectors.getAvailableDiskSpace(state);
    const usedStorage = sharedStateSelectors.getUsedStorage(state);

    if(rejectUploads || (usedStorage + uploadFileSize > baseAvailableDiskSpace)) {
        res.status(204);
        store.dispatch(sharedStateActions.notifyUserErrorMessage("disk quota exceeded. Delete files from storage"))
        return
    }
    
    if (fs.existsSync(filePathname)) {
        res.status(204).send()
        store.dispatch(sharedStateActions.notifyUserErrorMessage("Duplicate filenames disallowed"))
    } else {
        fs.writeFile(filePathname, buffer, () => {});
        res.sendStatus(204);
    }
})

export default router;
