export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "No autenticado" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "No tienes permisos" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Error en autorización" });
    }
  };
};