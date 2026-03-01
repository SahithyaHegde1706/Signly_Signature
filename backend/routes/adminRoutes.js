const express = require("express");
const User = require("../models/User");
const Document = require("../models/Document");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔥 GET SYSTEM STATS
router.get("/stats", protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDocuments = await Document.countDocuments();
    const signed = await Document.countDocuments({ status: "signed" });
    const pending = await Document.countDocuments({ status: "pending" });
    const rejected = await Document.countDocuments({ status: "rejected" });

    res.json({
      totalUsers,
      totalDocuments,
      signed,
      pending,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 GET ALL USERS
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 GET ALL DOCUMENTS
router.get("/documents", protect, isAdmin, async (req, res) => {
  try {
    const documents = await Document.find().populate("uploadedBy", "name email");
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 DELETE USER
router.delete("/users/:id", protect, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 DELETE DOCUMENT (ADMIN)
router.delete("/documents/:id", protect, isAdmin, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await document.deleteOne();

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;