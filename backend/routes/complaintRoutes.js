// ======================================
// EXPRESS ROUTER
// ======================================

const express = require("express");

const router = express.Router();


// ======================================
// IMPORT CONTROLLER
// ======================================

const {

    getAllComplaints,
    createComplaint,
    getComplaintByTrackingId

} = require("../controllers/complaintController");


// ======================================
// ROUTES
// ======================================

// GET ALL COMPLAINTS
router.get("/", getAllComplaints);


// CREATE COMPLAINT
router.post("/", createComplaint);


// GET COMPLAINT BY TRACKING ID
router.get("/:trackingId", getComplaintByTrackingId);


// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router;