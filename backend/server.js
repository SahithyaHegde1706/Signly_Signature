const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const documentRoutes = require("./routes/documentRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
const signatureRoutes = require("./routes/signatureRoutes");
const auditRoutes = require("./routes/auditRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

/* =============================
   🔥 GLOBAL CORS CONFIG
============================= */

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
/* =============================
   🔥 STATIC FILE SERVING (VERY IMPORTANT FIX)
============================= */

app.use(
  "/uploads",
  cors({ origin: "http://localhost:5173" }), // allow CORS for files
  express.static(path.join(__dirname, "uploads"))
);

/* =============================
   ROUTES
============================= */

app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api/signatures", signatureRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Signly API Running...");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));