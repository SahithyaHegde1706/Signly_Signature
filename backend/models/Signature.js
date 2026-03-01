const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    x: {
      type: Number,
      required: true,
    },

    y: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    font: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    fontSize: {
      type: Number,
      default: 28,
    },

    isBold: {
      type: Boolean,
      default: false,
    },

    isItalic: {
      type: Boolean,
      default: false,
    },

    page: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Signature", signatureSchema);