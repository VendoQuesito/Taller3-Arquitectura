const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.id, email: decoded.email, role: decoded.role };
  } catch (e) {
    return null;
  }
};

module.exports = { verifyToken };
