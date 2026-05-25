import request from "supertest";

import app from "../../app";
import { AppDataSource } from "../../config/database";

let token = "";

const HORARIO_ID = "f10c1bdc-4a3a-4522-bb4e-74fd59f82792";

const DOCENTE_ID = "5e42c3ad-a656-4243-81fb-c1688f15b811";

const HOSPITAL_ID = "fdad763a-0434-43c3-8e00-60c3a41b1bf1";

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

describe("Salida anticipada", () => {
  it("detectar salida antes del horario", async () => {
    const entrada = await request(app)
      .post("/api/marcados")
      .set("Authorization", `Bearer ${token}`)
      .send({
        docenteId: DOCENTE_ID,

        horarioId: HORARIO_ID,

        tipoMarcado: "app_hospital",

        ubicacionId: HOSPITAL_ID,

        latitud: -16.47952,

        longitud: -68.19329,
      });

    console.log("ENTRADA =>", entrada.status, entrada.body);

    expect(entrada.status).toBe(201);

    const id = entrada.body.data.id;

    const salida = await request(app)
      .put(`/api/marcados/salida/${id}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("SALIDA =>", salida.status, salida.body);

    expect(salida.status).toBe(200);

    expect(salida.body.data.estadoAsistencia).toBe("salida_anticipada");
  });
});
