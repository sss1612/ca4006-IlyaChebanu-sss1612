import express from "express";
import store from "../store/store";
import {
  actions as sharedStateActions,
} from "../../shared/store/sharedState";

const router = express.Router()

router.post("/simulate",  (req, res) => {
    const { flag } = req.body;
    store.dispatch(sharedStateActions.simulateForcedDiskSpace(flag));
    res.sendStatus(204)
})

export default router;
