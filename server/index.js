const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const authRouter = require("./routes/auth");
const mediaRouter = require("./routes/media");

dotenv.config();

const app = express();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadDir));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/media", mediaRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
