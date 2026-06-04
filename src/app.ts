// app.ts
import "reflect-metadata";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();
import justificacionRoutes from "./routes/justificacionRoutes";
import { initDatabase } from "./config/database";
import { logger } from "./config/logger";
import { errorHandler } from "./middlewares/errorHandler";
import {
  authRouter,
  marcadosRouter,
  docentesRouter,
  horariosRouter,
  ubicacionesRouter,
  materiasRouter,
  paralelosRouter,
  reportesRouter,
  dashboardRouter,
  auditoriaRouter,
  usuariosRouter,
  sesionesRouter,
  ausenciasRouter,
  cierresRouter,
  controlPermanenciaRouter,
} from "./routes/index";
import { iniciarJobs } from "./jobs/attendanceJobs";
import observacionRoutes from "./routes/observacionRoutes";
import swaggerUi from "swagger-ui-express";
import syncRoutes from "./routes/syncRoutes";
import { swaggerSpec } from "./docs/swagger";

const app = express();
const PORT = parseInt(process.env.PORT || "3000");
const PREFIX = process.env.API_PREFIX || "/api";

// ─── Seguridad y utilidades ─────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] }),
);
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(
  "/docs",

  swaggerUi.serve,

  swaggerUi.setup(swaggerSpec),
);
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
    max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: "error",
      code: "RATE_LIMIT",
      message: "Demasiadas solicitudes. Espera un minuto.",
    },
  }),
);

// ─── Health ──────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "attendance-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── Rutas ───────────────────────────────────────────────────────────────────
app.use(`${PREFIX}/auth`, authRouter);
app.use(`${PREFIX}/marcados`, marcadosRouter);
app.use(`${PREFIX}/docentes`, docentesRouter);
app.use(`${PREFIX}/horarios`, horariosRouter);
app.use(`${PREFIX}/ubicaciones`, ubicacionesRouter);
app.use(`${PREFIX}/materias`, materiasRouter);
app.use(`${PREFIX}/paralelos`, paralelosRouter);
app.use(`${PREFIX}/reportes`, reportesRouter);
app.use(`${PREFIX}/dashboard`, dashboardRouter);
app.use(`${PREFIX}/auditoria`, auditoriaRouter);
app.use(`${PREFIX}/usuarios`, usuariosRouter);
app.use(`${PREFIX}/sesiones`, sesionesRouter);
app.use(`${PREFIX}/ausencias`, ausenciasRouter);
app.use(`${PREFIX}/cierres`, cierresRouter);
app.use(`${PREFIX}/sync`, syncRoutes);
app.use(`${PREFIX}/justificaciones`, justificacionRoutes);
app.use(`${PREFIX}/observaciones`, observacionRoutes);
app.use(
  `${PREFIX}/permanencia`,
  controlPermanenciaRouter,
);
// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    code: "NOT_FOUND",
    message: "Ruta no encontrada.",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

// ─── Arrancar ────────────────────────────────────────────────────────────────
async function bootstrap() {
  await initDatabase();

  iniciarJobs();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  bootstrap();
}

export default app;
