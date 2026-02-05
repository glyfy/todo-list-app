const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies.session;

  if (!token) {
    return res.stats(401).json({ message: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    console.log(payload);
    req.user_id = payload.user_id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
