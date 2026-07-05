create table public.flashcards (
  id bigint generated always as identity primary key,
  subject_id bigint not null references public.subjects on delete cascade,
  front_text text not null,
  back_text text not null,
  confidence_rating integer default 0,
  next_review_date date,
  created_at timestamp with time zone default now()
);

create index on public.flashcards (subject_id);

alter table public.flashcards enable row level security;

create policy "users can view their own flashcards"
  on public.flashcards for select
  using (
    exists (
      select 1 from public.subjects s
      where s.id = flashcards.subject_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can create their own flashcards"
  on public.flashcards for insert
  with check (
    exists (
      select 1 from public.subjects s
      where s.id = subject_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can update their own flashcards"
  on public.flashcards for update
  using (
    exists (
      select 1 from public.subjects s
      where s.id = flashcards.subject_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can delete their own flashcards"
  on public.flashcards for delete
  using (
    exists (
      select 1 from public.subjects s
      where s.id = flashcards.subject_id
      and s.user_id = auth.uid()
    )
  );