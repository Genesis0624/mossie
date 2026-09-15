// Runner de migraciones para Mossie.
//
// Aplica los .sql de supabase/migrations que aún no se han corrido, en orden.
// Usa una tabla de control (public._mossie_migrations) para no repetir.
//
// Base: las migraciones 0001–0011 ya fueron aplicadas a mano en el SQL Editor,
// así que en la PRIMERA corrida se marcan como aplicadas SIN ejecutarlas; de
// 0012 en adelante sí se ejecutan.
//
// Requiere SUPABASE_DB_URL en .env.local (Session pooler URI de Supabase).
// Uso:  node scripts/migrate.mjs

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const BASELINE_MAX = 11; // 0001..0011 ya aplicadas manualmente.

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const migrationsDir = join(root, "supabase", "migrations");

// Lee SUPABASE_DB_URL de .env.local sin depender de librerías externas.
function readDbUrl() {
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;
  let text = "";
  try {
    text = readFileSync(join(root, ".env.local"), "utf8");
  } catch {
    return null;
  }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*SUPABASE_DB_URL\s*=\s*(.*)\s*$/);
    if (m) return m[1].replace(/^["']|["']$/g, "").trim();
  }
  return null;
}

const num = (name) => {
  const m = name.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : NaN;
};

async function main() {
  const dbUrl = readDbUrl();
  if (!dbUrl) {
    console.error(
      "Falta SUPABASE_DB_URL en .env.local. Pega la URI del Session pooler de Supabase.",
    );
    process.exit(1);
  }

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  if (files.length === 0) {
    console.log("No hay migraciones.");
    return;
  }

  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    await client.query(
      "create table if not exists public._mossie_migrations (name text primary key, applied_at timestamptz not null default now())",
    );

    const { rows } = await client.query(
      "select name from public._mossie_migrations",
    );
    const applied = new Set(rows.map((r) => r.name));

    // Primera corrida: sembrar la base 0001..0011 como ya aplicadas.
    if (applied.size === 0) {
      for (const f of files) {
        if (num(f) <= BASELINE_MAX) {
          await client.query(
            "insert into public._mossie_migrations(name) values ($1) on conflict do nothing",
            [f],
          );
          applied.add(f);
          console.log(`base   ${f} (ya aplicada, marcada)`);
        }
      }
    }

    let count = 0;
    for (const f of files) {
      if (applied.has(f)) continue;
      const sql = readFileSync(join(migrationsDir, f), "utf8");
      process.stdout.write(`aplicando ${f} ... `);
      try {
        await client.query("begin");
        await client.query(sql);
        await client.query(
          "insert into public._mossie_migrations(name) values ($1)",
          [f],
        );
        await client.query("commit");
        console.log("OK");
        count++;
      } catch (err) {
        await client.query("rollback");
        console.log("ERROR");
        console.error(`\nFalló ${f}:\n${err.message}`);
        process.exit(1);
      }
    }

    console.log(
      count === 0
        ? "Nada pendiente: la base está al día."
        : `Listo: ${count} migración(es) aplicada(s).`,
    );
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
