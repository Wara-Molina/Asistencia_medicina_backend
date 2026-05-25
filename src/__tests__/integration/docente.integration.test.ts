import request from "supertest";

import app from "../../app";

import { AppDataSource } from "../../config/database";

let token = "";

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const login = await request(app).post("/api/auth/login").send({
    email: "admin@medicina.edu.bo",
    password: "Admin@2024!",
  });

  token = login.body.data?.accessToken || "";

  if (!token) {
    throw new Error(`Login falló: ${JSON.stringify(login.body)}`);
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Docentes API", () => {
  it("crear docente y usuario automático", async () => {
    const response = await request(app)
      .post("/api/docentes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombreCompleto: "Dr. Test Integracion",

        email: `test_${Date.now()}@medicina.edu.bo`,

        cedula: `${Date.now()}`,

        departamento: "Anatomía",
      });

    expect(response.status).toBe(201);

    expect(response.body.status).toBe("success");

    expect(response.body.data.docente.estado).toBe("activo");

    expect(response.body.data.credencialesIniciales).toBeDefined();
  });

  it("listar docentes", async () => {
    const response = await request(app)
      .get("/api/docentes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.status).toBe("success");

    expect(Array.isArray(response.body.data)).toBeTruthy();
  });
  it("rechazar email duplicado", async () => {
    const payload = {
      nombreCompleto: "Docente Duplicado",

      email: "admin@medicina.edu.bo",

      cedula: `${Date.now()}`,

      departamento: "Cirugía",
    };

    const response = await request(app)
      .post("/api/docentes")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(409);
  });
});
