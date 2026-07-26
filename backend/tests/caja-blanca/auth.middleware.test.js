import { jest, describe, it, expect, beforeAll } from "@jest/globals";
import { verifyToken } from "../../src/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../src/middlewares/role.middleware.js";
import jwt from "jsonwebtoken";

describe("Prueba de Caja Blanca: Middlewares de Autenticación y Autorización", () => {
  const mockSecret = "jwt_secret_prueba_caja_blanca";
  beforeAll(() => {
    process.env.JWT_SECRET = mockSecret;
  });

  describe("verifyToken (Manejo de Tokens JWT)", () => {
    it("debe retornar HTTP 401 'No token' si la cabecera Authorization está ausente", () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "No token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("debe retornar HTTP 403 'Token inválido' si el token está adulterado o expirado", () => {
      const req = { headers: { authorization: "Bearer token_falso_invalido" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Token inválido" });
      expect(next).not.toHaveBeenCalled();
    });

    it("debe decodificar exitosamente un token válido y llamar a next() asignando req.user", () => {
      const payload = { id: 10, email: "test@utnay.edu.mx", role: "ALUMNO" };
      const tokenValido = jwt.sign(payload, mockSecret);

      const req = { headers: { authorization: `Bearer ${tokenValido}` } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.email).toBe("test@utnay.edu.mx");
      expect(req.user.role).toBe("ALUMNO");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("authorizeRoles (Control de Acceso Basado en Roles)", () => {
    it("debe retornar HTTP 401 si req.user no existe", () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const middleware = authorizeRoles("ADMIN");
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "No autenticado" });
    });

    it("debe retornar HTTP 403 si el rol del usuario no tiene permisos para la ruta", () => {
      const req = { user: { role: "ALUMNO" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const middleware = authorizeRoles("ADMIN", "DEVELOPER");
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "No tienes permisos" });
      expect(next).not.toHaveBeenCalled();
    });

    it("debe permitir el paso con next() si el usuario posee un rol autorizado", () => {
      const req = { user: { role: "ADMIN" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const middleware = authorizeRoles("ADMIN");
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
