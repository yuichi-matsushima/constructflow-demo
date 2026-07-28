import { ZodError } from "zod";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function errorMessageOf(err: unknown, fallback: string): string {
  if (err instanceof ZodError) {
    return err.issues.map((issue) => issue.message).join(" / ");
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
