import express from "express";
import store from "../store/store";
import {
  actions as sharedStateActions,
  selectors as sharedStateSelectors,
} from "../../shared/store/sharedState";
import fs from 'fs';
import path from 'path';

const router = express.Router()

router.delete("/input",  (req, res, next) => {
  const inputFiles = sharedStateSelectors.getUploadedFiles(store.getState());
  if (!inputFiles.includes(req.query.filename)) {
    res.status(404).send();
  }

  const pathName = `${path.dirname(require.main.filename)}/../../uploads/${req.query.filename}`;
  fs.unlink(pathName, err => {
    if (err) {
      console.error(err);
      return next(err);
    }
    store.dispatch(sharedStateActions.removeUploadedFile(req.query.filename));
  });
});

router.delete('/output', (req, res, next) => {
  const outputFiles = sharedStateSelectors.getOutputFiles(store.getState());
  if (!outputFiles.includes(req.query.filename)) {
    res.status(404).send();
  }

  const pathName = `${path.dirname(require.main.filename)}/../../output_files/${req.query.filename}`;
  fs.unlink(pathName, err => {
    if (err) {
      console.error(err);
      return next(err);
    }
    store.dispatch(sharedStateActions.removeOutputFile(req.query.filename));
  });
});

export default router;
