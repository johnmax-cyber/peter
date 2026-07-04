create table public.subjects (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  created_at timestamp with time zone default now()
);

create index on public.subjects (user_id);

alter table public.subjects enable row level security;

create policy "users can view their own subjects"
  on public.subjects for select
  using (auth.uid() = user_id);

create policy "users can create their own subjects"
  on public.subjects for insert
  with check (auth.uid() = user_id);

create policy "users can update their own subjects"
  on public.subjects for update
  using (auth.uid() = user_id);

create policy "users can delete their own subjects"
  on public.subjects for delete
  using (auth.uid() = user_id);

create table public.topics (
  id bigint generated always as identity primary key,
  subject_id bigint not null references public.subjects on delete cascade,
  name text not null,
  order_index integer not null default 0,
  created_at timestamp with time zone default now()
);

create index on public.topics (subject_id);

alter table public.topics enable row level security;

create policy "users can view their own topics"
  on public.topics for select
  using (
    exists (
      select 1 from public.subjects s
      where s.id = topics.subject_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can create their own topics"
  on public.topics for insert
  with check (
    exists (
      select 1 from public.subjects s
      where s.id = subject_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can update their own topics"
  on public.topics for update
  using (
    exists (
      select 1 from public.subjects s
      where s.id = topics.subject_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can delete their own topics"
  on public.topics for delete
  using (
    exists (
      select 1 from public.subjects s
      where s.id = topics.subject_id
      and s.user_id = auth.uid()
    )
  );