import request from "supertest";

import app from "../../app";

import { AppDataSource } from "../../config/database";

let token = "";

let justificacionId = "";

let marcadoId = "";

const DOCENTE_ID = "5e42c3ad-a656-4243-81fb-c1688f15b811";

const HORARIO_ID = "f10c1bdc-4a3a-4522-bb4e-74fd59f82792";

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

  // crear marcado real

  const marcado = await request(app)
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

  marcadoId = marcado.body.data.id;

  console.log("MARCADO =>", marcadoId);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Justificaciones", () => {
  it("crear justificacion", async () => {
    const response = await request(app)
      .post("/api/justificaciones")
      .set("Authorization", `Bearer ${token}`)
      .send({
        marcadoId: marcadoId,

        docenteId: DOCENTE_ID,

        tipo: "ausencia",

        motivo: "Emergencia médica",

        archivo: "certificado.pdf",
      });

    console.log(response.body);

    expect(response.status).toBe(201);

    justificacionId = response.body.data.id;
  });

  it("aprobar", async () => {
    const response = await request(app)
      .patch(`/api/justificaciones/${justificacionId}/aprobar`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        observaciones: "Aceptada",
      });

    console.log(response.body);

    expect(response.status).toBe(200);

    expect(response.body.data.estado).toBe("aprobada");
  });
});
