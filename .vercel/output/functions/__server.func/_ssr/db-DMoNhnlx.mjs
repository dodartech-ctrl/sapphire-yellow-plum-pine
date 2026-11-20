// node_modules/.nitro/vite/services/ssr/assets/db-DMoNhnlx.js
var _0001_studio_credits_default = "create table if not exists studio_wallet (\n  id text primary key,\n  credits integer not null check (credits >= 0),\n  credit_max integer not null,\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists credit_ledger (\n  id text primary key,\n  amount integer not null,\n  reason text not null,\n  balance integer not null,\n  created_at timestamptz not null default now()\n);\n\ninsert into studio_wallet (id, credits, credit_max)\nvalues ('studio', 4500, 5000)\non conflict (id) do nothing;\n";
var _0002_brief_collab_default = "create table if not exists shared_briefs (\n  id text primary key,\n  title text not null,\n  author_name text not null default 'Lead Architect',\n  snapshot_json jsonb not null,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists brief_comments (\n  id text primary key,\n  share_id text not null references shared_briefs(id) on delete cascade,\n  parameter_key text not null,\n  parameter_label text not null,\n  parameter_value text not null default '',\n  author_name text not null,\n  author_role text not null default 'Team Reviewer',\n  body text not null,\n  status text not null default 'open' check (status in ('open', 'resolved')),\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists idx_brief_comments_share_created\n  on brief_comments (share_id, created_at asc);\n";
var _0003_nano_banana_orchestration_default = "-- Nano Banana Image Engine & AI Orchestration Persistence Schema\n-- Compatible with both PostgreSQL (DATABASE_URL) and embedded PGLite.\n\ncreate table if not exists generations (\n  id text primary key,\n  trace_id text not null,\n  project_id text not null default 'default-studio',\n  user_id text not null default 'studio-architect',\n  parent_generation_id text,\n  session_id text,\n  idempotency_key text,\n  provider text not null default 'google_gemini',\n  provider_model_id text not null,\n  logical_model_key text not null,\n  generation_mode text not null,\n  task_intent text not null,\n  reference_manifest jsonb not null default '[]'::jsonb,\n  output_resolution text not null default '2K',\n  output_aspect_ratio text not null default '16:9',\n  generation_prompt text not null,\n  compiled_prompt text not null,\n  negative_instructions text not null default '',\n  provider_request_id text,\n  provider_response_metadata jsonb not null default '{}'::jsonb,\n  quality_score integer not null default 0,\n  quality_status text not null default 'needs_review',\n  evaluation_json jsonb not null default '{}'::jsonb,\n  trace_json jsonb not null default '{}'::jsonb,\n  fallback_used boolean not null default false,\n  fallback_reason text,\n  status text not null default 'completed',\n  output_image_url text,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists idx_generations_project_created\n  on generations (project_id, created_at desc);\n\ncreate index if not exists idx_generations_session_created\n  on generations (session_id, created_at asc);\n\ncreate unique index if not exists idx_generations_idempotency\n  on generations (idempotency_key)\n  where idempotency_key is not null;\n\ncreate table if not exists generation_assets (\n  id text primary key,\n  generation_id text not null references generations(id) on delete cascade,\n  asset_role text not null,\n  source_asset_id text,\n  reference_order integer not null default 0,\n  mime_type text not null default 'image/png',\n  width integer,\n  height integer,\n  storage_key text not null,\n  checksum text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists idx_generation_assets_gen\n  on generation_assets (generation_id, reference_order asc);\n\ncreate table if not exists image_edit_sessions (\n  id text primary key,\n  project_id text not null default 'default-studio',\n  user_id text not null default 'studio-architect',\n  base_generation_id text not null,\n  current_generation_id text not null,\n  session_status text not null default 'active',\n  turn_count integer not null default 1,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate index if not exists idx_image_edit_sessions_project\n  on image_edit_sessions (project_id, updated_at desc);\n\ncreate table if not exists image_reference_links (\n  id text primary key,\n  generation_id text not null references generations(id) on delete cascade,\n  asset_id text not null,\n  reference_type text not null,\n  priority integer not null default 2,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists idx_image_reference_links_gen\n  on image_reference_links (generation_id, priority asc);\n\ncreate table if not exists provider_model_usage (\n  id text primary key,\n  generation_id text not null references generations(id) on delete cascade,\n  provider text not null default 'google_gemini',\n  model_id text not null,\n  input_tokens integer not null default 0,\n  output_tokens integer not null default 0,\n  image_count integer not null default 1,\n  estimated_cost numeric(10, 5) not null default 0,\n  actual_cost numeric(10, 5) not null default 0,\n  latency_ms integer not null default 0,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists idx_provider_model_usage_gen\n  on provider_model_usage (generation_id, created_at desc);\n\ncreate table if not exists generation_stages (\n  id text primary key,\n  generation_id text not null references generations(id) on delete cascade,\n  stage_order integer not null,\n  stage_name text not null,\n  status text not null,\n  duration_ms integer not null default 0,\n  detail text not null default '',\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists idx_generation_stages_gen\n  on generation_stages (generation_id, stage_order asc);\n\ncreate table if not exists project_memories (\n  id text primary key,\n  project_id text not null,\n  memory_type text not null,\n  content text not null,\n  provenance text not null default 'system',\n  updated_at timestamptz not null default now()\n);\n\ncreate index if not exists idx_project_memories_project\n  on project_memories (project_id, updated_at desc);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0001_studio_credits.sql": _0001_studio_credits_default,
			"/migrations/0002_brief_collab.sql": _0002_brief_collab_default,
			"/migrations/0003_nano_banana_orchestration.sql": _0003_nano_banana_orchestration_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
export { getSql };
