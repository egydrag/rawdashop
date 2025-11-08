import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

// Simple local .env loader: if DATABASE_URL isn't set in process.env,
// try to read it from a local `.env` file in the project root. This avoids
// requiring an external dependency (dotenv) and ensures `env("DATABASE_URL")`
// can find the variable when Prisma loads this config file.
const envPath = resolve(process.cwd(), ".env");
if (!process.env.DATABASE_URL && existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    let val = trimmed.slice(idx + 1);
    // strip surrounding quotes if present
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
