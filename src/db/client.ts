import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cached: NeonHttpDatabase<typeof schema> | undefined;

// 遅延初期化: ビルド時(DATABASE_URL未設定のCI等)にimportだけで落ちないようにする
export function getDb(): NeonHttpDatabase<typeof schema> {
  cached ??= drizzle(neon(process.env.DATABASE_URL!), { schema });
  return cached;
}
