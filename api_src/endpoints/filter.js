import express from "express";
import bodyParser from "body-parser";
import store from "../store/store";
import spawnWorker from "../utils/spawnWorker";
import { actions as userUploadActions } from "../../shared/store/userUpload";
const router = express.Router()

router.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return
    } else {
        next();
    }
})

router.use(bodyParser.json());
router.post("/filter", async (req, res, next) => {
    try {
        const bodyData = req.body;
        const chunkStats = await spawnWorker(bodyData, `${__dirname}/../workers/metadataWorker.js`)
        res.send(`${Date.now()}: ayy lmao: done`)
        store.dispatch(userUploadActions.addMetadata(chunkStats));
    } catch (error) {
        console.error(error);
        next(error);
    }
})

export default router;
