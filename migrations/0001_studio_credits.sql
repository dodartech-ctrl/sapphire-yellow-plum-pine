create table if not exists studio_wallet (
  id text primary key,
  credits integer not null check (credits >= 0),
  credit_max integer not null,
  updated_at timestamptz not null default now()
);

create table if not exists credit_ledger (
  id text primary key,
  amount integer not null,
  reason text not null,
  balance integer not null,
  created_at timestamptz not null default now()
);

insert into studio_wallet (id, credits, credit_max)
values ('studio', 4500, 5000)
on conflict (id) do nothing;
