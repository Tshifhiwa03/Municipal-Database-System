const {
  openEvidenceDownloadStream,
  findEvidenceFile,
} = require("../image-upload");

const getEvidenceImageById = async (req, res) => {
  try {
    const { imageId } = req.params;

    const file = await findEvidenceFile(imageId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.setHeader("Content-Type", file.contentType || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=86400");

    const stream = await openEvidenceDownloadStream(imageId);
    stream.on("error", () => {
      res.status(500).end();
    });
    stream.pipe(res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid image id",
    });
  }
};

module.exports = {
  getEvidenceImageById,
};

