/**  src/config/cache.ts
 * Cache en memoria (Map) — reemplaza Redis mientras no esté disponible.
 * Cuando agregues Redis más adelante, solo cambia este archivo.
 * La interfaz es idéntica: getCache / setCache / invalidateCache.
 */

interface CacheEntry {
  value: string;
  expiresAt: number; // timestamp ms
}

const store = new Map<string, CacheEntry>();

// Limpieza automática cada 5 minutos para no acumular memoria
if (process.env.NODE_ENV !== "test") {
  setInterval(
    () => {
      const now = Date.now();

      for (const [key, entry] of store.entries()) {
        if (entry.expiresAt < now) {
          store.delete(key);
        }
      }
    },

    300000,
  );
}

export async function getCache<T>(key: string): Promise<T | null> {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }
  return JSON.parse(entry.value) as T;
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number,
): Promise<void> {
  store.set(key, {
    value: JSON.stringify(value),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function invalidateCache(pattern: string): Promise<void> {
  // Soporte básico de wildcard al final: "horarios:docente:*"
  const prefix = pattern.replace(/\*$/, "");
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}

// TTLs en segundos
export const CACHE_TTL = {
  HORARIOS: 86400, // 24 h
  UBICACIONES: 86400, // 24 h
  DOCENTES: 3600, // 1 h
};

// Keys helpers
export const CacheKeys = {
  horarioDocente: (id: string, semestre: string) =>
    `horarios:docente:${id}:${semestre}`,
  horarioParalelo: (id: string) => `horarios:paralelo:${id}`,
  ubicaciones: () => `ubicaciones:all`,
  docente: (id: string) => `docente:${id}`,
};
