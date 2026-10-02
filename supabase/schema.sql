-- SplitMate database schema for Supabase (Postgres)
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).

-- People who can participate in groups/expenses
create table if not exists public.people (
  id    text primary key,
  name  text not null,
  email text not null default ''
);

-- Groups (trips, homes, events). Members stored as an array of people ids.
create table if not exists public.groups (
  id         text primary key,
  name       text not null,
  members    text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Expenses. splits is a json map of personId -> amount owed.
create table if not exists public.expenses (
  id          text primary key,
  description text not null,
  group_id    text not null references public.groups(id) on delete cascade,
  paid_by     text not null references public.people(id),
  amount      numeric not null,
  date        date not null default now(),
  split_type  text not null default 'equal',
  splits      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- Settlement payments between people.
create table if not exists public.payments (
  id         text primary key,
  "from"     text not null references public.people(id),
  "to"       text not null references public.people(id),
  amount     numeric not null,
  date       date not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists expenses_group_id_idx on public.expenses(group_id);
create index if not exists expenses_created_at_idx on public.expenses(created_at);
create index if not exists payments_created_at_idx on public.payments(created_at);
