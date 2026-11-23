#!/usr/bin/env node
/**
 * Copy PGLite's runtime assets next to the bundled server function.
 *
 * The bundler inlines PGLite's JS but not its `pglite.wasm` / `pglite.data` /
 * `initdb.wasm` files, so a production build served WITHOUT a DATABASE_URL (the
 * local `npm run preview` check) crashed the whole server the first time any
 * page touched the database (the studio reads credits on every page).
 *
 * The copy is unconditional on purpose: whether PGLite or a real database is used
 * is decided at RUNTIME, and the build and runtime environments can differ (a
 * missing file there is a crash, an extra 13 MB here is not).
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const PGLITE_ASSETS = ["pglite.wasm", "pglite.data", "initdb.wasm"];

/** Returns the list of files copied (empty when there is no server build yet). */
export function copyPgliteAssets(root) {
  const target = join(root, ".vercel", "output", "functions", "__server.func", "_libs");
  if (!existsSync(join(root, ".vercel", "output", "functions", "__server.func"))) return [];
  const source = join(root, "node_modules", "@electric-sql", "pglite", "dist");
  mkdirSync(target, { recursive: true });
  const copied = [];
  for (const name of PGLITE_ASSETS) {
    const from = join(source, name);
    if (!existsSync(from)) continue;
    copyFileSync(from, join(target, name));
    copied.push(name);
  }
  return copied;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = dirname(dirname(fileURLToPath(import.meta.url)));
  const copied = copyPgliteAssets(root);
  console.log(copied.length ? `[pglite] copied ${copied.join(", ")} for the local production preview` : "[pglite] nothing to copy (no server build)");
}
