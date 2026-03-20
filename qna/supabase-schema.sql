create table if not exists public.questions (
  id text primary key,
  author text,
  content text not null,
  created_at timestamptz not null default now(),
  status text not null default 'received',
  model_answer text,
  speaker_note text
);

create index if not exists questions_created_at_idx
  on public.questions (created_at desc);

alter table public.questions enable row level security;

drop policy if exists "anon can read questions" on public.questions;
create policy "anon can read questions"
  on public.questions
  for select
  to anon, authenticated
  using (true);

drop policy if exists "anon can insert questions" on public.questions;
create policy "anon can insert questions"
  on public.questions
  for insert
  to anon, authenticated
  with check (true);
