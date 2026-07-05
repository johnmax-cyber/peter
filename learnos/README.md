# LearnOS

A lightweight learning management system built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Environment Variables

Create a `.env` file in the `learnos/` directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running Locally

```bash
cd learnos
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Supabase Schema

Apply the migrations in `supabase/migrations/` to your Supabase project in chronological order.

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles with role (`student` or `admin`), defaults to `student` |
| `subjects` | Study subjects, owned by a user |
| `topics` | Topics within a subject, with ordering |
| `lessons` | Lessons within a topic, with markdown content, duration, and difficulty |
| `quizzes` | Quizzes within a topic |
| `quiz_questions` | Multiple-choice questions belonging to a quiz |
| `quiz_attempts` | Records of quiz submissions with scores |
| `flashcards` | Flashcards within a subject, with spaced-repetition fields |
| `flashcard_reviews` | Review history for flashcards |

### Key Relationships

- `profiles.id` -> `auth.users.id` (cascade delete)
- `subjects.user_id` -> `auth.users.id`
- `topics.subject_id` -> `subjects.id`
- `lessons.topic_id` -> `topics.id`
- `quizzes.topic_id` -> `topics.id`
- `quiz_questions.quiz_id` -> `quizzes.id`
- `quiz_attempts.quiz_id` -> `quizzes.id`, `user_id` -> `auth.users.id`
- `flashcards.subject_id` -> `subjects.id`
- `flashcard_reviews.flashcard_id` -> `flashcards.id`, `user_id` -> `auth.users.id`

### Row Level Security

All tables have RLS enabled. Users can only access their own data (subjects owned by them, lessons in their subjects, etc.). The `profiles` table includes a policy allowing admins to view all user profiles.

### Auth Trigger

A trigger automatically creates a `profiles` row with `role = 'student'` when a new `auth.users` entry is made.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — TypeScript check and production build
- `npm run lint` — Run Oxlint
- `npm run preview` — Preview production build locally
