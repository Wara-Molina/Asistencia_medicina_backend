// src/config/env.ts
import { cleanEnv, str, num } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: num(),
  DB_HOST: str(),
  DB_PASSWORD: str(),
  JWT_SECRET: str(),
});
