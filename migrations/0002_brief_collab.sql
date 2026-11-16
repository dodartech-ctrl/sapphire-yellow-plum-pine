create table if not exists shared_briefs (
  id text primary key,
  title text not null,
  author_name text not null default 'Lead Architect',
  snapshot_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists brief_comments (
  id text primary key,
  share_id text not null references shared_briefs(id) on delete cascade,
  parameter_key text not null,
  parameter_label text not null,
  parameter_value text not null default '',
  author_name text not null,
  author_role text not null default 'Team Reviewer',
  body text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists idx_brief_comments_share_created
  on brief_comments (share_id, created_at asc);
