import express from "express";

const router = express.Router()

router.get("/upload", (req, res) => {
    res.send("this is part of the upload router")
})

export default router;
