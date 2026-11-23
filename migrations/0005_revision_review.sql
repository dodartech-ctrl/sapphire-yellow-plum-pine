-- Revision Studio: private client review links and append-only sign-off.
-- Rows are unowned (no accounts): access is by an unguessable link token only.
-- There is intentionally no list, update or delete-all endpoint.
create table if not exists revision_reviews (
  id text primary key,
  project_name text not null,
  change_request text not null default '',
  finish_json jsonb not null,
  set_id text not null,
  set_json jsonb not null,
  images_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists revision_decisions (
  id text primary key,
  review_id text not null references revision_reviews(id) on delete cascade,
  set_id text not null,
  decision text not null check (decision in ('approved', 'changes_requested')),
  reviewer_name text not null,
  note text not null default '',
  pins_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_revision_decisions_review
  on revision_decisions (review_id, created_at asc);
