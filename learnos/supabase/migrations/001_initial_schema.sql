-- Users table (extends Supabase auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users on delete cascade,
    full_name text,
    avatar_url text,
    role text not null default 'student' check (role in ('student', 'tutor', 'admin')),
    email_verified boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Subjects
create table if not exists public.subjects (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users on delete cascade,
    name text not null,
    description text,
    color text,
    is_archived boolean not null default false,
    "order" integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(user_id, name)
);

-- Topics
create table if not exists public.topics (
    id uuid primary key default gen_random_uuid(),
    subject_id uuid not null references public.subjects on delete cascade,
    name text not null,
    description text,
    "order" integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Lessons
create table if not exists public.lessons (
    id uuid primary key default gen_random_uuid(),
    topic_id uuid not null references public.topics on delete cascade,
    title text not null,
    content text not null,
    "order" integer not null default 0,
    duration_minutes integer,
    difficulty integer check (difficulty between 1 and 5),
    is_completed boolean not null default false,
    is_bookmarked boolean not null default false,
    version integer not null default 1,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Quizzes
create table if not exists public.quizzes (
    id uuid primary key default gen_random_uuid(),
    subject_id uuid not null references public.subjects on delete cascade,
    title text not null,
    description text,
    "order" integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Questions
create table if not exists public.questions (
    id uuid primary key default gen_random_uuid(),
    quiz_id uuid not null references public.quizzes on delete cascade,
    type text not null check (type in ('multiple_choice', 'true_false', 'fill_blank', 'ordering')),
    content text not null,
    options jsonb,
    correct_answer text not null,
    explanation text,
    "order" integer not null default 0
);

-- Quiz Attempts
create table if not exists public.quiz_attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users on delete cascade,
    quiz_id uuid not null references public.quizzes on delete cascade,
    score numeric,
    started_at timestamptz not null default now(),
    completed_at timestamptz,
    answers jsonb
);

-- Flashcard Decks
create table if not exists public.flashcard_decks (
    id uuid primary key default gen_random_uuid(),
    topic_id uuid not null references public.topics on delete cascade,
    name text not null,
    description text,
    "order" integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Flashcards
create table if not exists public.flashcards (
    id uuid primary key default gen_random_uuid(),
    deck_id uuid not null references public.flashcard_decks on delete cascade,
    front text not null,
    back text not null,
    ease_factor numeric not null default 2.5,
    interval integer not null default 1,
    repetitions integer not null default 0,
    next_review timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Study Sessions
create table if not exists public.study_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users on delete cascade,
    subject_id uuid references public.subjects on delete set null,
    topic_id uuid references public.topics on delete set null,
    scheduled_start timestamptz not null,
    scheduled_end timestamptz not null,
    actual_start timestamptz,
    actual_end timestamptz,
    status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
    title text not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Achievements
create table if not exists public.achievements (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text not null,
    icon text not null,
    criteria jsonb not null
);

-- User Achievements
create table if not exists public.user_achievements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users on delete cascade,
    achievement_id uuid not null references public.achievements on delete cascade,
    unlocked_at timestamptz not null default now(),
    unique(user_id, achievement_id)
);

-- Notifications
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users on delete cascade,
    type text not null,
    title text not null,
    message text not null,
    is_read boolean not null default false,
    metadata jsonb,
    created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.lessons enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.flashcard_decks enable row level security;
alter table public.flashcards enable row level security;
alter table public.study_sessions enable row level security;
alter table public.notifications enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

-- RLS Policies
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);

create policy "subjects_all" on public.subjects for all using (auth.uid() = user_id);
create policy "topics_all" on public.topics for all using (auth.uid() = subject_id in (select user_id from public.subjects where id = topics.subject_id));
create policy "lessons_all" on public.lessons for all using (auth.uid() = topic_id in (select id from public.topics where subject_id in (select id from public.subjects where user_id = auth.uid())));
create policy "quizzes_all" on public.quizzes for all using (auth.uid() = subject_id in (select user_id from public.subjects where id = quizzes.subject_id));
create policy "questions_all" on public.questions for all using (auth.uid() = quiz_id in (select id from public.quizzes where subject_id in (select id from public.subjects where user_id = auth.uid())));
create policy "quiz_attempts_all" on public.quiz_attempts for all using (auth.uid() = user_id);
create policy "flashcard_decks_all" on public.flashcard_decks for all using (auth.uid() = topic_id in (select id from public.topics where subject_id in (select id from public.subjects where user_id = auth.uid())));
create policy "flashcards_all" on public.flashcards for all using (auth.uid() = deck_id in (select id from public.flashcard_decks where topic_id in (select id from public.topics where subject_id in (select id from public.subjects where user_id = auth.uid()))));
create policy "study_sessions_all" on public.study_sessions for all using (auth.uid() = user_id);
create policy "notifications_all" on public.notifications for all using (auth.uid() = user_id);
create policy "achievements_select" on public.achievements for select using (true);
create policy "user_achievements_all" on public.user_achievements for all using (auth.uid() = user_id);

-- Role-based policies for admin
create policy "admin_profiles" on public.profiles for select using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "admin_subjects" on public.subjects for select using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "admin_analytics" on public.quiz_attempts for select using (auth.uid() in (select id from public.profiles where role = 'admin'));