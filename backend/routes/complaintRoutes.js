const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
    getAllComplaints,
    createComplaint,
    getComplaintByTrackingId
} = require("../controllers/complaintController");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

router.get("/", getAllComplaints);

router.post("/", upload.single("evidence"), createComplaint);

router.get("/:trackingId", getComplaintByTrackingId);

module.exports = router;