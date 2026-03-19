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
