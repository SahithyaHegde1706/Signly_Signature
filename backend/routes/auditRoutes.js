const express = require("express");
const Audit = require("../models/Audit");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:docId", protect, async (req, res) => {
  try {
    const audits = await Audit.find({
      documentId: req.params.docId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;