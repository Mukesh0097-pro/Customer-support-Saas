const jwt = require("jsonwebtoken");

// No DB lookup — the JWT payload itself (id, name, email, avatar) becomes req.user.
function protect(req, res, next) {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
}

module.exports = { protect };
