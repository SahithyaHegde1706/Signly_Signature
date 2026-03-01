const express = require("express");
const router = express.Router();
const Signature = require("../models/Signature");
const { protect } = require("../middleware/authMiddleware");

/* =============================
   🔥 SAVE SIGNATURE
============================= */
router.post("/", protect, async (req, res) => {
  try {
    const {
      documentId,
      x,
      y,
      text,
      font,
      color,
      fontSize,
      isBold,
      isItalic,
      page,
    } = req.body;

    const signature = await Signature.create({
      documentId,
      userId: req.user._id,
      x,
      y,
      text,
      font,
      color,
      fontSize,
      isBold,
      isItalic,
      page,
    });

    res.status(201).json(signature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   🔥 GET SIGNATURES FOR DOCUMENT
============================= */
router.get("/:documentId", protect, async (req, res) => {
  try {
    const signatures = await Signature.find({
      documentId: req.params.documentId,
    });

    res.json(signatures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   🔥 DELETE SIGNATURE
============================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const signature = await Signature.findById(req.params.id);

    if (!signature) {
      return res.status(404).json({ message: "Signature not found" });
    }

    if (signature.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await signature.deleteOne();

    res.json({ message: "Signature deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   🔥 UPDATE SIGNATURE POSITION
============================= */
router.put("/:id", protect, async (req, res) => {
  try {
    const { x, y, fontSize } = req.body;

    const signature = await Signature.findById(req.params.id);

    if (!signature) {
      return res.status(404).json({ message: "Signature not found" });
    }

    if (signature.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    signature.x = x;
    signature.y = y;

    if (fontSize !== undefined) {
      signature.fontSize = fontSize;
    }

    await signature.save();

    res.json(signature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;