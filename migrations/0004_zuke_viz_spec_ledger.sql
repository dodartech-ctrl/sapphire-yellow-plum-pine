-- ZUKE VIZ AI Implementation Specification v1.0.0 — Durable Ledger, Brief CAS, Thread Memory, G01-G11 Gates & Approvals
-- Additive migration preserving all prior tables (0001..0003).

create table if not exists zuke_brief_versions (
  id text primary key,
  tenant_id text not null default 'default-tenant',
  project_id text not null,
  revision integer not null,
  parent_revision integer,
  content_json jsonb not null,
  brief_hash text not null,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, project_id, revision)
);

create index if not exists idx_zuke_brief_versions_proj_rev
  on zuke_brief_versions (tenant_id, project_id, revision desc);

create table if not exists zuke_threads (
  id text primary key,
  tenant_id text not null default 'default-tenant',
  project_id text not null,
  next_seq integer not null default 1,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_zuke_threads_proj
  on zuke_threads (tenant_id, project_id);

create table if not exists zuke_messages (
  id text primary key,
  tenant_id text not null default 'default-tenant',
  project_id text not null,
  thread_id text not null,
  seq integer not null,
  client_message_id text not null,
  payload_hash text not null,
  author_type text not null,
  state text not null default 'final',
  content text not null,
  evidence_json jsonb not null default '[]'::jsonb,
  revision integer not null default 1,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (thread_id, seq),
  unique (thread_id, client_message_id)
);

create index if not exists idx_zuke_messages_thread_seq
  on zuke_messages (thread_id, seq asc);

create table if not exists zuke_memory_items (
  id text primary key,
  tenant_id text not null default 'default-tenant',
  project_id text not null,
  scope text not null default 'project',
  category text not null,
  item_key text not null,
  item_value text not null,
  state text not null default 'proposed',
  version integer not null default 1,
  confidence numeric(4, 3) not null default 0.85,
  supersedes_id text,
  evidence_ids jsonb not null default '[]'::jsonb,
  effective_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_zuke_memory_items_proj_state
  on zuke_memory_items (tenant_id, project_id, state, effective_at desc);

create table if not exists zuke_approvals (
  id text primary key,
  tenant_id text not null default 'default-tenant',
  project_id text not null,
  run_id text not null,
  candidate_sha256 text not null,
  brief_hash text not null,
  brief_revision integer not null,
  reviewer_id text not null,
  reviewer_role text not null default 'architect_reviewer',
  decision text not null,
  findings_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_zuke_approvals_run
  on zuke_approvals (project_id, run_id, created_at desc);

create table if not exists zuke_audit_events (
  id text primary key,
  tenant_id text not null default 'default-tenant',
  project_id text not null,
  actor_id text not null,
  action text not null,
  resource_id text not null,
  outcome text not null,
  trace_id text not null,
  detail_json jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_zuke_audit_events_proj
  on zuke_audit_events (tenant_id, project_id, occurred_at desc);
