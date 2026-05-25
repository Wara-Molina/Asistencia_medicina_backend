// src/__tests__/marcado.integration.test.ts

import request from "supertest";
import app from "../../app";
import { AppDataSource } from "../../config/database";

let token = "";

beforeAll(async () => {
  // Inicializar BD test
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Login real contra medicina_test
  const login = await request(app).post("/api/auth/login").send({
    email: "admin@medicina.edu.bo",
    password: "Admin@2024!",
  });

  // Guardar JWT
  token = login.body.data?.accessToken || "";

  // Verificación por seguridad
  if (!token) {
    throw new Error(
      `No se obtuvo token. Respuesta login: ${JSON.stringify(login.body)}`,
    );
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Marcados API", () => {
  it("listar marcados", async () => {
    const response = await request(app)
      .get("/api/marcados")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.status).toBe("success");
  });
});
