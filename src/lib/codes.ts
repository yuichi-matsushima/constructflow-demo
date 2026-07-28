export function nextCode(prefix: string, year: number, codes: string[]): string {
  const yearPrefix = `${prefix}-${year}-`;
  const max = codes.reduce((m, c) => {
    if (!c.startsWith(yearPrefix)) return m;
    const n = parseInt(c.slice(yearPrefix.length), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `${yearPrefix}${String(max + 1).padStart(3, "0")}`;
}

export function nextId(prefix: string, ids: string[]): string {
  const max = ids.reduce((m, id) => {
    const n = Number(id.split("-")[1]);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `${prefix}-${max + 1}`;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function yearOf(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

function isUniqueViolation(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: unknown; cause?: { code?: unknown } }).code
    ?? (err as { cause?: { code?: unknown } }).cause?.code;
  return code === "23505";
}

export async function withUniqueRetry<T>(
  attempt: () => Promise<T>,
  retries = 3
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await attempt();
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
      lastError = err;
    }
  }
  throw lastError;
}
