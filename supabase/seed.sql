-- Seed data for SplitMate. Run after schema.sql.
-- Safe to re-run: uses upsert / conflict handling.

insert into public.people (id, name, email) values
  ('yash',   'Yash',   'you@example.com'),
  ('apurva', 'Apurva', 'apurva@example.com'),
  ('manan',  'Manan',  'manan@example.com')
on conflict (id) do update set name = excluded.name, email = excluded.email;

insert into public.groups (id, name, members) values
  ('scotland', 'Scotland Trip', array['yash','apurva','manan'])
on conflict (id) do update set name = excluded.name, members = excluded.members;

insert into public.expenses (id, description, group_id, paid_by, amount, date, split_type, splits) values
  ('demo', 'Hotel booking', 'scotland', 'yash', 300, '2026-10-01', 'equal',
   '{"yash":100,"apurva":100,"manan":100}'::jsonb)
on conflict (id) do nothing;
