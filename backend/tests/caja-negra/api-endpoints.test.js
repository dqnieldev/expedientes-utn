import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";

describe("Prueba de Caja Negra: Interfaces y Entradas/Salidas de la API REST", () => {
  it("Caso 1: Estado del Servidor - GET / debe responder HTTP 200 con mensaje de confirmación", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("API Expedientes UTN funcionando");
  });

  it("Caso 2: Protección de Rutas - GET /api/alumnos sin token debe rechazar acceso con HTTP 401", async () => {
    const res = await request(app).get("/api/alumnos");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "No token");
  });

  it("Caso 3: Validación de Credenciales - POST /api/auth/login con cuerpo vacío debe retornar HTTP 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({});
    expect(res.statusCode).toEqual(400);
  });

  it("Caso 4: Acceso a Datasets - GET /api/analitica/dataset sin credenciales debe ser denegado", async () => {
    const res = await request(app).get("/api/analitica/dataset");
    expect([401, 403]).toContain(res.statusCode);
  });
});
