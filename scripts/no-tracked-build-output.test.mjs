import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test("the generated .vercel build output is never committed", () => {
  // A committed copy is stale and partial and crashes at runtime (FUNCTION_INVOCATION_FAILED).
  let tracked = "";
  try {
    tracked = execFileSync("git", ["ls-files", ".vercel"], { cwd: root, encoding: "utf8" });
  } catch {
    return; // not a git checkout (e.g. a tarball): nothing to check
  }
  assert.equal(tracked.trim(), "", `tracked build output: ${tracked.split("\n").slice(0, 3).join(", ")}`);
});

test(".vercel/ is gitignored", () => {
  assert.match(readFileSync(join(root, ".gitignore"), "utf8"), /^\.vercel\/?$/m);
});
