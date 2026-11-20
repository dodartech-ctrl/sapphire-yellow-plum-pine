-- Nano Banana Image Engine & AI Orchestration Persistence Schema
-- Compatible with both PostgreSQL (DATABASE_URL) and embedded PGLite.

create table if not exists generations (
  id text primary key,
  trace_id text not null,
  project_id text not null default 'default-studio',
  user_id text not null default 'studio-architect',
  parent_generation_id text,
  session_id text,
  idempotency_key text,
  provider text not null default 'google_gemini',
  provider_model_id text not null,
  logical_model_key text not null,
  generation_mode text not null,
  task_intent text not null,
  reference_manifest jsonb not null default '[]'::jsonb,
  output_resolution text not null default '2K',
  output_aspect_ratio text not null default '16:9',
  generation_prompt text not null,
  compiled_prompt text not null,
  negative_instructions text not null default '',
  provider_request_id text,
  provider_response_metadata jsonb not null default '{}'::jsonb,
  quality_score integer not null default 0,
  quality_status text not null default 'needs_review',
  evaluation_json jsonb not null default '{}'::jsonb,
  trace_json jsonb not null default '{}'::jsonb,
  fallback_used boolean not null default false,
  fallback_reason text,
  status text not null default 'completed',
  output_image_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_generations_project_created
  on generations (project_id, created_at desc);

create index if not exists idx_generations_session_created
  on generations (session_id, created_at asc);

create unique index if not exists idx_generations_idempotency
  on generations (idempotency_key)
  where idempotency_key is not null;

create table if not exists generation_assets (
  id text primary key,
  generation_id text not null references generations(id) on delete cascade,
  asset_role text not null,
  source_asset_id text,
  reference_order integer not null default 0,
  mime_type text not null default 'image/png',
  width integer,
  height integer,
  storage_key text not null,
  checksum text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_generation_assets_gen
  on generation_assets (generation_id, reference_order asc);

create table if not exists image_edit_sessions (
  id text primary key,
  project_id text not null default 'default-studio',
  user_id text not null default 'studio-architect',
  base_generation_id text not null,
  current_generation_id text not null,
  session_status text not null default 'active',
  turn_count integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_image_edit_sessions_project
  on image_edit_sessions (project_id, updated_at desc);

create table if not exists image_reference_links (
  id text primary key,
  generation_id text not null references generations(id) on delete cascade,
  asset_id text not null,
  reference_type text not null,
  priority integer not null default 2,
  created_at timestamptz not null default now()
);

create index if not exists idx_image_reference_links_gen
  on image_reference_links (generation_id, priority asc);

create table if not exists provider_model_usage (
  id text primary key,
  generation_id text not null references generations(id) on delete cascade,
  provider text not null default 'google_gemini',
  model_id text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  image_count integer not null default 1,
  estimated_cost numeric(10, 5) not null default 0,
  actual_cost numeric(10, 5) not null default 0,
  latency_ms integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_provider_model_usage_gen
  on provider_model_usage (generation_id, created_at desc);

create table if not exists generation_stages (
  id text primary key,
  generation_id text not null references generations(id) on delete cascade,
  stage_order integer not null,
  stage_name text not null,
  status text not null,
  duration_ms integer not null default 0,
  detail text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_generation_stages_gen
  on generation_stages (generation_id, stage_order asc);

create table if not exists project_memories (
  id text primary key,
  project_id text not null,
  memory_type text not null,
  content text not null,
  provenance text not null default 'system',
  updated_at timestamptz not null default now()
);

create index if not exists idx_project_memories_project
  on project_memories (project_id, updated_at desc);
