create table public.flashcard_reviews (
  id bigint generated always as identity primary key,
  flashcard_id bigint not null references public.flashcards on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  reviewed_at timestamp with time zone default now()
);

create index on public.flashcard_reviews (flashcard_id);
create index on public.flashcard_reviews (user_id);
create index on public.flashcard_reviews (reviewed_at);

alter table public.flashcard_reviews enable row level security;

create policy "users can view their own flashcard reviews"
  on public.flashcard_reviews for select
  using (auth.uid() = user_id);

create policy "users can create their own flashcard reviews"
  on public.flashcard_reviews for insert
  with check (auth.uid() = user_id);

create policy "users can update their own flashcard reviews"
  on public.flashcard_reviews for update
  using (auth.uid() = user_id);

create policy "users can delete their own flashcard reviews"
  on public.flashcard_reviews for delete
  using (auth.uid() = user_id);