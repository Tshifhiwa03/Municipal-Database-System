const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
    getAllComplaints,
    createComplaint,
    getComplaintByTrackingId,
    getAllStaff,
    updateComplaint
} = require("../controllers/complaintController");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

router.get("/", getAllComplaints);
router.get("/staff", getAllStaff);
router.get("/:trackingId", getComplaintByTrackingId);
router.post("/", upload.single("evidence"), createComplaint);
router.put("/:id", updateComplaint);

module.exports = router;