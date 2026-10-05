const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const kbRoutes = require("./routes/kbRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Public chat widget open CORS
app.use("/api/chat", cors());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/conversations", conversationRoutes);

// centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

module.exports = app;
