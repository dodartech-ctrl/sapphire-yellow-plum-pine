import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

async function wallet() {
  const pg = new PGlite();
  await pg.waitReady;
  await pg.exec(readFileSync(new URL("../migrations/0001_studio_credits.sql", import.meta.url), "utf8"));
  return pg;
}

async function charge(pg, cost, reason) {
  const id = `c-${Math.random().toString(36).slice(2)}`;
  const result = await pg.query(
    `with charged as (
      update studio_wallet
      set credits = credits - $1, updated_at = now()
      where id = 'studio' and credits >= $1
      returning credits
    )
    insert into credit_ledger (id, amount, reason, balance)
    select $2, $3, $4, credits from charged
    returning balance`,
    [cost, id, -cost, reason],
  );
  return result.rows[0]?.balance ?? null;
}

test("a plate deducts 50 and a failed plate is refunded", async () => {
  const pg = await wallet();
  const charged = await charge(pg, 50, "plate");
  assert.equal(Number(charged), 4450);
  const restored = await pg.query(
    `update studio_wallet set credits = least(credit_max, credits + 50) where id = 'studio' returning credits`,
  );
  assert.equal(Number(restored.rows[0].credits), 4500);
});

test("two charges cannot spend the same last 50 credits", async () => {
  const pg = await wallet();
  await pg.query("update studio_wallet set credits = 50 where id = 'studio'");
  const [first, second] = await Promise.all([charge(pg, 50, "a"), charge(pg, 50, "b")]);
  const spent = [first, second].filter((row) => row !== null);
  assert.equal(spent.length, 1);
  assert.equal(Number(spent[0]), 0);
  const left = await pg.query("select credits from studio_wallet where id = 'studio'");
  assert.equal(Number(left.rows[0].credits), 0);
});
