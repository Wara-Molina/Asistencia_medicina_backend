// src/services/authService.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Usuario, UsuarioRol } from "../models/Usuario";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_CAMBIA_EN_PRODUCCION";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev_refresh_CAMBIA_EN_PRODUCCION";
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface JwtPayload {
  sub: string;
  email: string;
  rol: UsuarioRol;
  docenteId?: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

// ─── Blacklist en memoria (se limpia al reiniciar el servidor) ───────────────
// Cuando integres Redis, reemplaza este Map por redis.setEx / redis.get
const tokenBlacklist = new Map<string, number>(); // token -> expiry ms

// Limpieza cada 10 min
if (process.env.NODE_ENV !== "test") {
  setInterval(
    () => {
      const now = Date.now();

      for (const [token, exp] of tokenBlacklist.entries()) {
        if (exp < now) {
          tokenBlacklist.delete(token);
        }
      }
    },

    600000,
  );
}

export function generarTokens(usuario: Usuario): TokenPair {
  const payload: JwtPayload = {
    sub: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
    docenteId: usuario.docenteId,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ sub: usuario.id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES,
  } as jwt.SignOptions);

  return { accessToken, refreshToken, expiresIn: JWT_EXPIRES_IN };
}

export function verificarAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verificarRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string };
}

export function invalidarToken(token: string): void {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  const expMs = decoded?.exp
    ? decoded.exp * 1000
    : Date.now() + 8 * 3600 * 1000;
  tokenBlacklist.set(token, expMs);
}

export function tokenEstaInvalidado(token: string): boolean {
  const exp = tokenBlacklist.get(token);
  if (!exp) return false;
  if (exp < Date.now()) {
    tokenBlacklist.delete(token);
    return false;
  }
  return true;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verificarPassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
