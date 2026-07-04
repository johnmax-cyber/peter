create table public.quizzes (
  id bigint generated always as identity primary key,
  topic_id bigint not null references public.topics on delete cascade,
  title text not null,
  created_at timestamp with time zone default now()
);

create index on public.quizzes (topic_id);

alter table public.quizzes enable row level security;

create policy "users can view their own quizzes"
  on public.quizzes for select
  using (
    exists (
      select 1 from public.topics t
      join public.subjects s on s.id = t.subject_id
      where t.id = quizzes.topic_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can create their own quizzes"
  on public.quizzes for insert
  with check (
    exists (
      select 1 from public.topics t
      join public.subjects s on s.id = t.subject_id
      where t.id = topic_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can update their own quizzes"
  on public.quizzes for update
  using (
    exists (
      select 1 from public.topics t
      join public.subjects s on s.id = t.subject_id
      where t.id = quizzes.topic_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can delete their own quizzes"
  on public.quizzes for delete
  using (
    exists (
      select 1 from public.topics t
      join public.subjects s on s.id = t.subject_id
      where t.id = quizzes.topic_id
      and s.user_id = auth.uid()
    )
  );

create table public.quiz_questions (
  id bigint generated always as identity primary key,
  quiz_id bigint not null references public.quizzes on delete cascade,
  question_text text not null,
  choices jsonb not null,
  correct_choice_index integer not null,
  explanation text,
  created_at timestamp with time zone default now()
);

create index on public.quiz_questions (quiz_id);

alter table public.quiz_questions enable row level security;

create policy "users can view their own quiz questions"
  on public.quiz_questions for select
  using (
    exists (
      select 1 from public.quizzes q
      join public.topics t on t.id = q.topic_id
      join public.subjects s on s.id = t.subject_id
      where q.id = quiz_questions.quiz_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can create their own quiz questions"
  on public.quiz_questions for insert
  with check (
    exists (
      select 1 from public.quizzes q
      join public.topics t on t.id = q.topic_id
      join public.subjects s on s.id = t.subject_id
      where q.id = quiz_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can update their own quiz questions"
  on public.quiz_questions for update
  using (
    exists (
      select 1 from public.quizzes q
      join public.topics t on t.id = q.topic_id
      join public.subjects s on s.id = t.subject_id
      where q.id = quiz_questions.quiz_id
      and s.user_id = auth.uid()
    )
  );

create policy "users can delete their own quiz questions"
  on public.quiz_questions for delete
  using (
    exists (
      select 1 from public.quizzes q
      join public.topics t on t.id = q.topic_id
      join public.subjects s on s.id = t.subject_id
      where q.id = quiz_questions.quiz_id
      and s.user_id = auth.uid()
    )
  );

create table public.quiz_attempts (
  id bigint generated always as identity primary key,
  quiz_id bigint not null references public.quizzes on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  score integer not null,
  taken_at timestamp with time zone default now()
);

create index on public.quiz_attempts (quiz_id);

alter table public.quiz_attempts enable row level security;

create policy "users can view their own quiz attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "users can create their own quiz attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "users can update their own quiz attempts"
  on public.quiz_attempts for update
  using (auth.uid() = user_id);

create policy "users can delete their own quiz attempts"
  on public.quiz_attempts for delete
  using (auth.uid() = user_id);