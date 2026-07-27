import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";

describe("Prueba de Caja Negra: Flujo de Gestión de Expedientes", () => {
  it("Caso 1: GET /api/documentos sin token debe retornar HTTP 401 por falta de credenciales", async () => {
    const res = await request(app).get("/api/documentos");
    expect([401, 403]).toContain(res.statusCode);
  });

  it("Caso 2: POST /api/documentos sin token debe ser denegado por el middleware de seguridad", async () => {
    const res = await request(app)
      .post("/api/documentos")
      .send({ tipo: "Acta" });
    expect([401, 403]).toContain(res.statusCode);
  });

  it("Caso 3: PUT /api/documentos/1 sin token debe rechazar el intento de actualización de dictamen", async () => {
    const res = await request(app)
      .put("/api/documentos/1")
      .send({ estado: "APROBADO" });
    expect([401, 403]).toContain(res.statusCode);
  });
});
