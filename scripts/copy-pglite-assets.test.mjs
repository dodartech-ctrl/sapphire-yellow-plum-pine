import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { copyPgliteAssets, PGLITE_ASSETS } from "./copy-pglite-assets.mjs";

function fakeProject() {
  const root = mkdtempSync(join(tmpdir(), "pglite-assets-"));
  const dist = join(root, "node_modules", "@electric-sql", "pglite", "dist");
  mkdirSync(dist, { recursive: true });
  for (const name of PGLITE_ASSETS) writeFileSync(join(dist, name), name);
  mkdirSync(join(root, ".vercel", "output", "functions", "__server.func"), { recursive: true });
  return root;
}

test("copies the PGLite runtime files next to the server bundle when no database URL is set", () => {
  const root = fakeProject();
  const copied = copyPgliteAssets(root, {});
  assert.deepEqual(copied.sort(), [...PGLITE_ASSETS].sort());
  for (const name of PGLITE_ASSETS) assert.ok(existsSync(join(root, ".vercel/output/functions/__server.func/_libs", name)));
});

test("copies nothing on a real deployment (DATABASE_URL set)", () => {
  assert.deepEqual(copyPgliteAssets(fakeProject(), { DATABASE_URL: "postgres://x" }), []);
});

test("copies nothing when there is no server build yet", () => {
  const root = mkdtempSync(join(tmpdir(), "pglite-none-"));
  assert.deepEqual(copyPgliteAssets(root, {}), []);
});
