const Audit = require("../models/Audit");

const logAudit = async ({ documentId, userId, action, req }) => {
  try {
    await Audit.create({
      documentId,
      userId,
      action,
      ipAddress: req.ip,
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};

module.exports = logAudit;