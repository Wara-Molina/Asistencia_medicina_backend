// src/config/database.ts

import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

import { Docente } from "../models/Docente";
import { Materia } from "../models/Materia";
import { Paralelo } from "../models/Paralelo";
import { Horario } from "../models/Horario";
import { Ubicacion } from "../models/Ubicacion";
import { Marcado } from "../models/Marcado";
import { Usuario } from "../models/Usuario";
import { Audit } from "../models/Audit";
import { Sesion } from "../models/Sesion";
import { Justificacion } from "../models/Justificacion";
import { ObservacionDirector } from "../models/ObservacionDirector";
import { ControlPermanencia } from "../models/ControlPermanencia";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  ),
});

export const AppDataSource = new DataSource({
  type: "postgres",

  host: process.env.DB_HOST,

  port: parseInt(process.env.DB_PORT || "5432"),

  username: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  synchronize: process.env.DB_SYNC === "true",

  logging: process.env.DB_LOGGING === "true",

  entities: [
    Docente,
    Materia,
    Paralelo,
    Horario,
    Ubicacion,
    Marcado,
    Usuario,
    Audit,
    Sesion,
    Justificacion,
    ObservacionDirector,
    ControlPermanencia,
  ],

  migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],

  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  },
});

const initDatabase = async () => {
  try {
    await AppDataSource.initialize();

    console.log("✅ Base de datos conectada correctamente");
  } catch (error) {
    console.error("❌ Error BD:", error);

    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }

    throw error;
  }
};

export { initDatabase };

export default AppDataSource;
