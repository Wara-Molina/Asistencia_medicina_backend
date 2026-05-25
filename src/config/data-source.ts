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

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  ),
});

const AppDataSource = new DataSource({
  type: "postgres",

  host: process.env.DB_HOST,

  port: parseInt(process.env.DB_PORT || "5432"),

  username: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  synchronize: false,

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
  ],

  migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
});

export default AppDataSource;
