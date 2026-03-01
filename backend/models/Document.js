const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    // ✅ NEW: file size in bytes
    fileSize: {
      type: Number,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "signed", "rejected"],
      default: "pending",
    },

    // ✅ NEW: who signed
    signedBy: {
      type: String,
    },

    signedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
    },

    signToken: {
      type: String,
    },

    signTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Document ||
  mongoose.model("Document", documentSchema);