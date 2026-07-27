import { describe, it, expect, beforeAll } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("Prueba de Caja Blanca: Servicio de Autenticación y Encriptación", () => {
  const SECRET_KEY = "clave_secreta_prueba_caja_blanca";

  beforeAll(() => {
    process.env.JWT_SECRET = SECRET_KEY;
  });

  describe("Encriptación de Contraseñas (Bcrypt)", () => {
    it("debe generar un hash seguro distinto del texto plano", async () => {
      const passwordPlana = "DevPassword123!";
      const hash = await bcrypt.hash(passwordPlana, 10);

      expect(hash).not.toEqual(passwordPlana);
      expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);
    });

    it("debe validar correctamente la contraseña correcta y rechazar una errónea", async () => {
      const passwordPlana = "DevPassword123!";
      const hash = await bcrypt.hash(passwordPlana, 10);

      const esValida = await bcrypt.compare(passwordPlana, hash);
      const esInvalida = await bcrypt.compare("PasswordErronea!", hash);

      expect(esValida).toBe(true);
      expect(esInvalida).toBe(false);
    });
  });

  describe("Firma y Verificación de Tokens (JWT)", () => {
    it("debe emitir un token firmado que contenga el payload del usuario", () => {
      const userPayload = { id: 42, role: "DEVELOPER", email: "dev@utnay.edu.mx" };
      const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: "1h" });

      expect(typeof token).toBe("string");
      
      const decoded = jwt.verify(token, SECRET_KEY);
      expect(decoded.id).toEqual(42);
      expect(decoded.role).toEqual("DEVELOPER");
      expect(decoded.email).toEqual("dev@utnay.edu.mx");
    });

    it("debe lanzar un error al intentar verificar un token adulterado", () => {
      const userPayload = { id: 42, role: "DEVELOPER" };
      const tokenValido = jwt.sign(userPayload, SECRET_KEY, { expiresIn: "1h" });
      const tokenAdulterado = tokenValido + "tampered";

      expect(() => {
        jwt.verify(tokenAdulterado, SECRET_KEY);
      }).toThrow();
    });
  });
});
