const generateToken = require("../utils/generateToken");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// GET /api/auth/google/callback — passport attaches req.user (the Google profile)
function googleCallback(req, res) {
  const token = generateToken(req.user);
  res.cookie("token", token, COOKIE_OPTIONS);

  const redirectUrl = process.env.CLIENT_URL || "http://localhost:5173";
  res.redirect(`${redirectUrl}/dashboard`);
}

// GET /api/auth/me — decoded JWT payload is attached as req.user by the middleware
function getMe(req, res) {
  res.json({ user: req.user });
}

// POST /api/auth/logout
function logout(req, res) {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
}

module.exports = { googleCallback, getMe, logout };
