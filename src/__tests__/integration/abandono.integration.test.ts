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
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Abandono Hospitalario", () => {
  it("detectar posible abandono", async () => {
    const entrada = await request(app)
      .post("/api/marcados")
      .set("Authorization", `Bearer ${token}`)
      .send({
        docenteId: "5e42c3ad-a656-4243-81fb-c1688f15b811",

        tipoMarcado: "app_hospital",

        ubicacionId: "fdad763a-0434-43c3-8e00-60c3a41b1bf1",

        latitud: -16.47952,

        longitud: -68.19329,
      });

    expect(entrada.status).toBe(201);

    const id = entrada.body.data.id;

    // forzar abandono
    await AppDataSource.query(
      `
UPDATE marcados
SET hora_inicio =
NOW() - interval '3 hour'
WHERE id=$1
`,
      [id],
    );

    const consulta = await request(app)
      .get(`/api/marcados/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(consulta.status).toBe(200);

    expect(consulta.body.data.estado).toBe("posible_abandono");
  });
});
