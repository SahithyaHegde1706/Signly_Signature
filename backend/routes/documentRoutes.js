const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/authMiddleware");
const Document = require("../models/Document");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const Signature = require("../models/Signature");
const crypto = require("crypto");
const logAudit = require("../utils/logAudit");

const router = express.Router();

/* =============================
   🔥 MULTER CONFIG
============================= */

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/* =============================
   📤 UPLOAD DOCUMENT
============================= */

router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    const document = await Document.create({
      title: req.body.title || req.file.originalname,
      filePath: req.file.path.replace(/\\/g, "/"),
      fileSize: req.file.size, // ✅ ADD THIS LINE
      uploadedBy: req.user._id,
      status: "pending",
    });

    await logAudit({
      documentId: document._id,
      userId: req.user._id,
      action: "Document Uploaded",
      req,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   📄 GET USER DOCUMENTS
============================= */

router.get("/", protect, async (req, res) => {
  try {
    const documents = await Document.find({
      uploadedBy: req.user._id,
    }).sort({ createdAt: -1 });

    const docsWithUrl = documents.map((doc) => ({
      ...doc._doc,
      fileUrl: `https://signly-signature.onrender.com/${doc.filePath}`,
    }));

    res.json(docsWithUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   🗑 DELETE DOCUMENT
============================= */

router.delete("/:id", protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await document.deleteOne();

    await logAudit({
      documentId: document._id,
      userId: req.user._id,
      action: "Document Deleted",
      req,
    });

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   ✏ UPDATE STATUS (Owner Only)
============================= */

router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    document.status = status;
    await document.save();

    await logAudit({
      documentId: document._id,
      userId: req.user._id,
      action: `Status changed to ${status}`,
      req,
    });

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   🖊 FINALIZE DOCUMENT
============================= */

router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const signatures = await Signature.find({
      documentId: document._id,
    });

    if (signatures.length === 0) {
      return res.status(400).json({ message: "No signatures to embed" });
    }

    const existingPdfBytes = fs.readFileSync(document.filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    signatures.forEach((sig) => {
      const absoluteX = sig.x * width;
      const absoluteY = height - sig.y * height;

      firstPage.drawText(sig.text, {
        x: absoluteX,
        y: absoluteY,
        size: sig.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const signedFilePath = document.filePath.replace(".pdf", "-signed.pdf");

    fs.writeFileSync(signedFilePath, pdfBytes);

    document.filePath = signedFilePath;
    document.status = "signed";
    document.signedBy = req.user.name;   // ✅ ADD THIS
    document.signedAt = new Date();      // ✅ ADD THIS
    await document.save();

    await logAudit({
      documentId: document._id,
      userId: req.user._id,
      action: "Document Finalized",
      req,
    });

    res.json({
      message: "Document signed successfully",
      filePath: signedFilePath,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   🔗 GENERATE PUBLIC SIGN LINK
============================= */

router.post("/:id/generate-link", protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    document.signToken = token;
    document.signTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await document.save();

    await logAudit({
      documentId: document._id,
      userId: req.user._id,
      action: "Public signing link generated",
      req,
    });

    res.json({
      message: "Signing link generated",
      signingLink: `http://localhost:5173/sign/${token}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   🌍 GET DOCUMENT BY TOKEN
============================= */

router.get("/public/:token", async (req, res) => {
  try {
    const document = await Document.findOne({
      signToken: req.params.token,
      signTokenExpiry: { $gt: Date.now() },
    });

    if (!document) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    res.json({
      _id: document._id,
      title: document.title,
      filePath: document.filePath,
      status: document.status,
      rejectionReason: document.rejectionReason,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =============================
   🌍 PUBLIC SIGNER ACTION (NEW - DAY 11)
============================= */

router.post("/public/:token/action", async (req, res) => {
  try {
    const { action, rejectionReason } = req.body;

    const document = await Document.findOne({
      signToken: req.params.token,
      signTokenExpiry: { $gt: Date.now() },
    });

    if (!document) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    if (action === "accept") {
      document.status = "signed";
      document.rejectionReason = "";
    }

    if (action === "reject") {
      document.status = "rejected";
      document.rejectionReason = rejectionReason || "No reason provided";
    }

    await document.save();

    await logAudit({
      documentId: document._id,
      userId: null, // public user
      action: `Public signer ${action}ed document`,
      req,
    });

    res.json({
      message: `Document ${action}ed successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;