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
router.post("/filter", (req, res) => {

    const bodyData = req.body;
    spawnWorker(bodyData, `${__dirname}/../workers/metadataWorker.js`)
    .then(chunkStats => {
        res.send(`${Date.now()}: ayy lmao: done`)
        store.dispatch(userUploadActions.addMetadata(chunkStats));
    })
    .catch(error => console.error(error));

})

export default router;
