import { n as OPENING_CREDITS, r as WALLET_ID, t as CREDIT_MAX } from "./credits-Dsn9xLgu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/credits.server-B7C2uEBU.js
function asCredits(value) {
	const credits = typeof value === "bigint" ? Number(value) : Number(value);
	if (!Number.isFinite(credits)) throw new Error("Credit balance could not be read.");
	return credits;
}
async function sqlClient() {
	const { getSql } = await import("./db-DUb5RBOV.mjs");
	return getSql();
}
async function ensureWallet() {
	const sql = await sqlClient();
	await sql`
    insert into studio_wallet (id, credits, credit_max)
    values (${WALLET_ID}, ${OPENING_CREDITS}, ${CREDIT_MAX})
    on conflict (id) do nothing
  `;
	return sql;
}
async function readWallet() {
	const rows = await (await ensureWallet())`
    select credits, credit_max from studio_wallet where id = ${WALLET_ID}
  `;
	return {
		credits: asCredits(rows[0]?.credits ?? 4500),
		creditMax: asCredits(rows[0]?.credit_max ?? 5e3)
	};
}
/** Deduct only when the balance covers the cost. One statement, so two clicks cannot overspend. */
async function charge(cost, reason) {
	if (!Number.isInteger(cost) || cost <= 0) throw new Error("Credit cost is invalid.");
	const sql = await ensureWallet();
	const id = `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	const rows = await sql`
    with charged as (
      update studio_wallet
      set credits = credits - ${cost}, updated_at = now()
      where id = ${WALLET_ID} and credits >= ${cost}
      returning credits
    )
    insert into credit_ledger (id, amount, reason, balance)
    select ${id}, ${-cost}, ${reason}, credits from charged
    returning balance as credits
  `;
	if (!rows[0]) throw new Error("Not enough credits.");
	return {
		credits: asCredits(rows[0].credits),
		creditMax: CREDIT_MAX
	};
}
async function refund(cost, reason) {
	if (!Number.isInteger(cost) || cost <= 0) throw new Error("Credit cost is invalid.");
	const sql = await ensureWallet();
	const id = `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	const rows = await sql`
    with restored as (
      update studio_wallet
      set credits = least(credit_max, credits + ${cost}), updated_at = now()
      where id = ${WALLET_ID}
      returning credits
    )
    insert into credit_ledger (id, amount, reason, balance)
    select ${id}, ${cost}, ${reason}, credits from restored
    returning balance as credits
  `;
	if (!rows[0]) throw new Error("Credit balance could not be restored.");
	return {
		credits: asCredits(rows[0].credits),
		creditMax: CREDIT_MAX
	};
}
//#endregion
export { charge, readWallet, refund };
