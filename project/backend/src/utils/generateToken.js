const jwt = require("jsonwebtoken");

// Signs the user's Google profile info straight into the JWT —
// no database round trip needed since there's nowhere to look it up.
function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

module.exports = generateToken;
