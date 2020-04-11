import express from "express";
import store from "../store/store";
import {
  actions as sharedStateActions,
  selectors as sharedStateSelectors,
} from "../../shared/store/sharedState";

const router = express.Router()

router.post("/process", async (req, res, next) => {
  try {
    const { filename, chunk } = req.body;
    const metadata = sharedStateSelectors.getMetadataSelector(store.getState());

    const file = metadata[filename];
    if (!file) {
      res.status(404).json({
        error: {
          code: 1,
          message: 'no metadata for given file',
        },
      });
      return next();
    }

    const chunkData = file[chunk];
    if (!chunkData) {
      res.status(404).json({
        error: {
          code: 2,
          message: 'chunk metadata not yet generated',
        },
      });
      return next();
    }

    store.dispatch(sharedStateActions.addToQueue({
      originalFilename: filename,
      chunk,
      filename: `${Math.random() * 10000 << 0}_${chunk || 'all'}_${filename}`
    }));
    res.status(202).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/process', (req, res) => {
  store.dispatch(sharedStateActions.removeFromQueue(req.query.filename));
  res.status(202).send();
});

export default router;
