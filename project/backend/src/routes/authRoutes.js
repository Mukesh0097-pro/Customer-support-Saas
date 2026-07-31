const express = require("express");
const passport = require("passport");
const { googleCallback, getMe, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/logout", logout);
router.get("/me", protect, getMe);

// Google OAuth — the only sign-in method now
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);

module.exports = router;
