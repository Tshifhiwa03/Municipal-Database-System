const express = require("express");
const router = express.Router();

const { getEvidenceImageById } = require("../controllers/imageController");

router.get("/:imageId", getEvidenceImageById);

module.exports = router;

