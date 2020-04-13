import express from "express";
const router = express.Router()


// store may not update on time
const cache = { lastAvailableDiskSpace: null, fileSizes: [0] };
router.post("/outputsizetracker", async (req, res) => {
    const { diskUsage } = req.body
    console.log("diskUsage", diskUsage)
    res.send(200)
})



export default router;
