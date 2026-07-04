create table public.lessons (
  id bigint generated always as identity primary key,
  topic_id bigint not null references public.topics on delete cascade,
  title text not null,
  content_markdown text not null default '',
  duration_minutes integer,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  completed boolean default false,
  created_at timestamp with time zone default now()
);

create index on public.lessons (topic_id);

alter table public.lessons enable row level security;

create policy "users can view their own lessons"
  on public.lessons for select
  using (
    exists (
      select 1 from public.topics t
      join public.subjects s on s.id = t.subject_id
      where t.id = lessons.topic_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can create their own lessons"
  on public.lessons for insert
  with check (
    exists (
      select 1 from public.topics t
      join public.subjects s on s.id = t.subject_id
      where t.id = topic_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can update their own lessons"
  on public.lessons for update
  using (
    exists (
      select 1 from public.topics t
      join public.subjects s on s.id = t.subject_id
      where t.id = lessons.topic_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can delete their own lessons"
  on public.lessons for delete
  using (
    exists (
      select 1 from public.topics t
      join public.subjects s on s.id = t.subject_id
      where t.id = lessons.topic_id
      and s.user_id = auth.uid()
    )
  );