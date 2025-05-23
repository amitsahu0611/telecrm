/** @format */

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({message: "Access token required"});
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({message: "Invalid token format"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTKEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({message: "Invalid or expired token"});
  }
};

module.exports = verifyToken;
