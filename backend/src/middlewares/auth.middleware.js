import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Si no hay token, retornamos error
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // El token viene en formato "Bearer token" 
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos info del usuario en request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};