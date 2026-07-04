# LearnOS

A modern educational platform with personalized learning, quizzes, flashcards, and progress tracking.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- TanStack Router & Query

## Features Implemented (MVP)

### Authentication
- Email/password registration with validation
- Login/logout functionality
- Profile management

### Dashboard
- Active subjects overview
- Quick action links

### Subjects
- Create/edit subjects
- Drag-and-drop reordering

### Lessons
- Rich text editor (TipTap)
- Metadata (duration, difficulty)

### Quizzes
- Multiple question types (multiple choice, true/false, fill blank, ordering)
- Quiz builder
- Auto-grading with instant feedback
- Quiz history tracking

### Flashcards
- Deck creation
- SM-2 spaced repetition algorithm
- Review modes

### Study Planner
- Calendar view
- Session scheduling

### Progress Tracking
- Lesson completion tracking
- Quiz score analytics

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Database

Run the migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.