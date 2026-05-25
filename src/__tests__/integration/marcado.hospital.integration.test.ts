import request from "supertest";
import app from "../../app";
import { AppDataSource } from "../../config/database";

let token = "";
jest.setTimeout(30000);
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
    throw new Error(JSON.stringify(login.body));
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Marcado Hospital", () => {
  it("probar GPS hospital", async () => {
    const response = await request(app)
      .post("/api/marcados")
      .set("Authorization", `Bearer ${token}`)
      .send({
        docenteId: "5e42c3ad-a656-4243-81fb-c1688f15b811",

        tipoMarcado: "app_hospital",

        ubicacionId: "fdad763a-0434-43c3-8e00-60c3a41b1bf1",

        latitud: -16.47952,

        longitud: -68.19329,
      });

    console.log(response.status, response.body);
    expect(response.status).toBe(201);

    expect(response.body.status).toBe("success");

    expect(["valido", "rechazado"]).toContain(response.body.data.estado);
  });
});

it("rechazar hospital sin GPS", async () => {
  const response = await request(app)
    .post("/api/marcados")
    .set("Authorization", `Bearer ${token}`)
    .send({
      docenteId: "5e42c3ad-a656-4243-81fb-c1688f15b811",

      tipoMarcado: "app_hospital",

      ubicacionId: "fdad763a-0434-43c3-8e00-60c3a41b1bf1",
    });

  expect(response.status).toBe(400);

  expect(response.body.code).toBe("GPS_REQUERIDO");
});

it("finalizar marcado hospital", async () => {
  // crear entrada

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

  // finalizar
  const salida = await request(app)
    .put(`/api/marcados/salida/${id}`)
    .set("Authorization", `Bearer ${token}`);

  console.log("SALIDA =>", salida.status, salida.body);

  expect(salida.status).toBe(200);

  expect(salida.body.data.horaFin).toBeTruthy();

  expect(salida.body.data.minutosTrabajados).toBeGreaterThanOrEqual(0);
});
