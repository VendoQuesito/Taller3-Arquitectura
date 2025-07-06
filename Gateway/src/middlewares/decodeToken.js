const jwt = require("jsonwebtoken");

const decodeToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token faltante o mal formado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Tendrás req.user.id y req.user.rol disponibles
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = decodeToken;
