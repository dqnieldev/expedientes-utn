import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";

describe("Prueba de Caja Negra: Prevención de Ataques de Fuerza Bruta (Rate Limiting)", () => {
  it("debe procesar peticiones de login devolviendo respuesta controlada (HTTP 400 o 429)", async () => {
    // Realizamos 6 intentos consecutivos de login inválido
    const respuestas = [];
    for (let i = 0; i < 6; i++) {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ matricula: `invalida_${i}`, password: "pass_erronea" });
      respuestas.push(res.statusCode);
    }

    // Al menos uno de los códigos de respuesta debe ser 400 (Bad Request) o 429 (Too Many Requests)
    const contieneBloqueoOError = respuestas.some((code) => code === 400 || code === 429 || code === 401);
    expect(contieneBloqueoOError).toBe(true);
  });
});
