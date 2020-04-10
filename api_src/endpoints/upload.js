import express from "express";
import multer from "multer";
import * as fs from "fs";
const router = express.Router()

const uploadPath = `${__dirname.split("/api_dist")[0]}/uploads`;

const storage = multer.memoryStorage()
const upload = multer({ storage: storage }).single("recfile");

router.use(upload)
router.post("/upload", (req, res) => {
    const {
        originalname: filename,
        buffer,
        size
    } = req.file;

    fs.writeFile(`${uploadPath}/${filename}`, buffer, () => {});
    res.send(204);
})

export default router;
