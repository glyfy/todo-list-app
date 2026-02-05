const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies.session;

  if (!token) {
    return res.stats(401).json({ message: "Not authenticated" });
  }

  try {
    // const authHeader = req.headers.authorization;
    // // if authorization header not exists, return null
    // if (authHeader == null) {
    //   return res.status(401).json({ error: "Missing Authorization Header" });
    // }
    // // check for correct jwt format
    // const parts = authHeader.split(" ");
    // if (parts.length < 2 || parts[0] != "Bearer") {
    //   return res.status(401).json({ error: "Invalid Authorization format" });
    // }
    // const token = parts[1];
    // // verify jwt
    // const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    // // add userid to req
    // req.user = { id: decoded.id };
    // // call next

    const payload = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
