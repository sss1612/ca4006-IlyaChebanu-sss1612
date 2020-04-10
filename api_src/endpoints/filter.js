import express from "express";
import bodyParser from "body-parser";
import store from "../store/store";
import spawnWorker from "../utils/spawnWorker";
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
    .then(data => {
        res.send(`${Date.now()}: ayy lmao ${data}`)
        console.log(store.getState());
    })
    .catch(error => console.error(error));

})

export default router;
