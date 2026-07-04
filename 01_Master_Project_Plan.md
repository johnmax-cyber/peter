# 01_Master_Project_Plan.md

## Executive Summary

LearnOS is a modern, scalable educational platform engineered to deliver a personalized learning experience comparable to industry leaders such as Khan Academy, Quizlet, Notion, and Duolingo. Built from the ground up using a contemporary web stack (React, TypeScript, Vite, Tailwind CSS, Supabase, PostgreSQL), the platform is designed to serve a single student initially while maintaining the architectural integrity to scale to thousands of concurrent users without re-engineering core systems.

The platform integrates authentication, subject management, rich lessons, interactive quizzes, adaptive flashcards, an intelligent study planner, progress tracking, an AI tutor, a file library, notifications, gamification, and a comprehensive admin dashboard. The emphasis is on maintainability, performance, accessibility, and developer experience.

---

## Vision

To create the most intuitive, engaging, and effective personalized learning environment on the web — one that adapts to the learner, organizes knowledge beautifully, and makes studying a habit rather than a chore.

---

## Mission

Empower learners of all ages to master any subject through structured content, active recall, spaced repetition, real-time feedback, and intelligent guidance — delivered through a fast, beautiful, and accessible interface.

---

## Goals

### Product Goals
- Deliver a seamless, app-like learning experience in the browser
- Support structured learning paths (subjects → topics → lessons)
- Enable active recall through quizzes and flashcards with spaced repetition
- Provide AI-assisted tutoring for conceptual understanding
- Maintain persistent progress and study planning across sessions
- Gamify the experience to encourage consistent engagement

### Business Goals
- Launch a Minimum Viable Product (MVP) that validates the core learning loop within 8 weeks
- Achieve 90%+ Lighthouse performance score on all core pages
- Maintain 99.9% uptime within the first 6 months
- Ensure WCAG 2.1 AA compliance across all user-facing components

### Technical Goals
- Architect a scalable monorepo-ready codebase
- Implement end-to-end type safety from database to UI
- Achieve sub-200ms Time to Interactive (TTI) on 3G connections
- Maintain 90%+ test coverage for business logic and critical user flows
- Establish CI/CD pipelines for automated testing and deployment

---

## Target Audience

### Primary
- Individual learners aged 14–35 pursuing academic excellence (high school, university, self-study)
- Motivated self-learners preparing for standardized tests or certifications

### Secondary
- Tutoring centers and small educational institutions requiring lightweight learning management
- Educators seeking a streamlined content delivery and assessment platform

---

## User Personas

### Persona 1: The High School Student
- **Name:** Alex
- **Age:** 16
- **Context:** Preparing for AP Computer Science and SAT exams
- **Goals:** Track study progress, use flashcards for memorization, take practice quizzes, plan study sessions
- **Pain Points:** Loses track of study materials, forgets scheduled study times, needs immediate feedback on answers
- **Device:** MacBook Pro at home, iPhone 14 on the go

### Persona 2: The University Student
- **Name:** Jordan
- **Age:** 21
- **Context:** Computer Science degree; juggling 5 courses
- **Goals:** Organize notes per subject, prioritize difficult topics, use AI tutor for complex concepts (e.g., algorithms)
- **Pain Points:** Disorganized digital notes, inconsistent study schedule, procrastination
- **Device:** Windows laptop, iPad Pro with Apple Pencil

### Persona 3: The Self-Learner
- **Name:** Sam
- **Age:** 28
- **Context:** Learning web development and data science independently
- **Goals:** Build a structured curriculum, track milestones, stay motivated through streaks and achievements
- **Pain Points:** Lack of structure in free online resources, no progress tracking, zero accountability
- **Device:** Desktop, some mobile usage

### Persona 4: The Tutor/Educator
- **Name:** Maria
- **Age:** 34
- **Context:** Runs a small tutoring business for 12 students
- **Goals:** Assign lessons, monitor student progress, identify struggling topics
- **Pain Points:** Manually grading quizzes, no centralized view of student performance
- **Device:** Chromebook, occasional mobile checks

### Persona 5: The Platform Administrator
- **Name:** Chris
- **Age:** 30
- **Context:** Manages content, users, and system health
- **Goals:** Manage user accounts, oversee platform analytics, moderate content
- **Pain Points:** Lack of visibility into usage patterns, manual user management
- **Device:** Desktop workstation

---

## Functional Requirements

### FR-1: Authentication & Authorization
- FR-1.1 Email/password registration with email verification
- FR-1.2 OAuth 2.0 social login (Google, GitHub)
- FR-1.3 Password reset via email
- FR-1.4 Session management with JWT and refresh tokens
- FR-1.5 Role-based access control (student, tutor, admin)
- FR-1.6 Account deletion and data export

### FR-2: Dashboard
- FR-2.1 Overview of active subjects, upcoming study sessions, and recent progress
- FR-2.2 Daily/weekly streak counter
- FR-2.3 Achievement badges and level progress
- FR-2.4 Quick links to resume study
- FR-2.5 Notification feed

### FR-3: Subject & Course Management
- FR-3.1 Create, edit, archive subjects
- FR-3.2 Organize subjects into topics (hierarchical)
- FR-3.3 Drag-and-drop reordering of topics and lessons

### FR-4: Lessons & Rich Notes
- FR-4.1 Rich text editor supporting Markdown, inline images, code blocks, LaTeX, and embeds
- FR-4.2 Lesson metadata (duration, difficulty, prerequisites)
- FR-4.3 Lesson completion tracking and bookmarking
- FR-4.4 Inline flashcards and quiz prompts within lessons
- FR-4.5 Reading time estimation

### FR-5: Quizzes
- FR-5.1 Multiple question types: multiple choice, true/false, fill-in-the-blank, ordering
- FR-5.2 Auto-grading with instant feedback
- FR-5.3 Explanations for correct and incorrect answers
- FR-5.4 Quiz history and analytics (time per question, accuracy by topic)
- FR-5.5 Retake capability with new question variants

### FR-6: Flashcards
- FR-6.1 Create, edit, delete flashcards
- FR-6.2 Spaced repetition algorithm (SM-2 or simplified variant)
- FR-6.3 Review modes: standard flip, typing answer, multiple choice
- FR-6.4 Deck organization by subject/topic
- FR-6.5 "Mastered" categorization and confidence ratings

### FR-7: Study Planner
- FR-7.1 Calendar view of scheduled study sessions
- FR-7.2 AI-suggested study schedules based on exams, deadlines, and weak topics
- FR-7.3 Task creation with priority levels
- FR-7.4 Reminders and notifications before sessions
- FR-7.5 Time-blocking with Pomodoro integration

### FR-8: Progress Tracking
- FR-8.1 Visual dashboards showing mastery by subject/topic
- FR-8.2 Weekly and monthly study time analytics
- FR-8.3 Streak tracking with recovery mechanics (streak freeze)
- FR-8.4 Skill/competency heatmaps
- FR-8.5 Exportable progress reports (PDF)

### FR-9: AI Tutor
- FR-9.1 Context-aware chat assistant aware of current subject/lesson
- FR-9.2 Socratic questioning to guide learner to answers
- FR-9.3 Explains concepts, provides examples, generates practice problems
- FR-9.4 Multi-turn conversation with memory of current study session
- FR-9.5 Streaming responses for perceived performance

### FR-10: File Library
- FR-10.1 Upload and organize PDFs, images, and documents
- FR-10.2 Tagging and search within file library
- FR-10.3 Attach files to subjects, topics, and lessons
- FR-10.4 Secure file storage with user-scoped access

### FR-11: Notifications
- FR-11.1 In-app notification center with categorized items (study reminders, achievements, system updates)
- FR-11.2 Email notifications (daily reminders, weekly summaries)
- FR-11.3 Browser push notifications
- FR-11.4 Notification preferences per user

### FR-12: Gamification
- FR-12.1 XP (experience points) for completing lessons, quizzes, flashcards, and study sessions
- FR-12.2 Level progression system with unlockable rewards
- FR-12.3 Achievement badges for milestones (streaks, mastery, consistency)
- FR-12.4 Leaderboards (optional, opt-in) for competitive subjects
- FR-12.5 Daily quests and challenges

### FR-13: Admin Dashboard
- FR-13.1 User management (view, invite, suspend, delete, role assignment)
- FR-13.2 Content management (subjects, topics, lessons, quizzes, flashcards)
- FR-13.3 Platform analytics and reporting (DAU, MAU, retention, engagement)
- FR-13.4 System health monitoring
- FR-13.5 Audit logs for administrative actions

### FR-14: Search
- FR-14.1 Global search across lessons, notes, flashcards, files, and subjects
- FR-14.2 Search result ranking with relevance
- FR-14.3 Advanced filters by type, subject, date, and difficulty

### FR-15: Responsive & Accessible Design
- FR-15.1 Full mobile responsiveness (320px–2560px viewport)
- FR-15.2 WCAG 2.1 AA compliance
- FR-15.3 Keyboard navigation across all interactive elements
- FR-15.4 Screen reader optimization with ARIA labels and live regions

---

## Non-functional Requirements

### NFR-1: Performance
- NFR-1.1 First Contentful Paint (FCP) < 1.0s on 4G
- NFR-1.2 Time to Interactive (TTI) < 2.5s on 4G
- NFR-1.3 Cumulative Layout Shift (CLS) < 0.1
- NFR-1.4 API p95 latency < 200ms
- NFR-1.5 Database query p95 latency < 50ms

### NFR-2: Scalability
- NFR-2.1 Support 1,000 concurrent authenticated users on initial infrastructure
- NFR-2.2 Horizontal scaling capability through Supabase and Vercel
- NFR-2.3 Database connection pooling for 500+ concurrent requests

### NFR-3: Reliability & Availability
- NFR-3.1 99.9% uptime for web application
- NFR-3.2 99.99% uptime for Supabase PostgreSQL and auth
- NFR-3.3 Graceful degradation for offline study (local caching)
- NFR-3.4 Automated database backups with point-in-time recovery

### NFR-4: Security
- NFR-4.1 All data encrypted in transit (TLS 1.3)
- NFR-4.2 All sensitive data encrypted at rest
- NFR-4.3 JWT tokens with short expiry and secure refresh rotation
- NFR-4.4 Role-based access control enforced at API and database row level
- NFR-4.5 No secrets in client-side bundles or version control

### NFR-5: Maintainability
- NFR-5.1 Complete TypeScript type safety (no `any` types)
- NFR-5.2 Consistent coding standards enforced by ESLint and Prettier
- NFR-5.3 90%+ test coverage for business logic
- NFR-5.4 Comprehensive documentation for every API endpoint and component
- NFR-5.5 Modular, feature-based folder structure

### NFR-6: Accessibility
- NFR-6.1 WCAG 2.1 AA compliance
- NFR-6.2 Full keyboard navigation
- NFR-6.3 Screen reader tested with NVDA, VoiceOver, and TalkBack
- NFR-6.4 Focus indicators with minimum 3:1 contrast ratio

### NFR-7: Browser Support
- NFR-7.1 Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- NFR-7.2 No IE11 support
- NFR-7.3 Progressive enhancement for core features

### NFR-8: Observability
- NFR-8.1 Structured logging with correlation IDs
- NFR-8.2 Error tracking via Sentry
- NFR-8.3 Performance monitoring via Vercel Analytics
- NFR-8.4 Uptime monitoring via Vercel or equivalent

---

## Complete Feature List

| ID | Module | Feature | Priority | Complexity |
|---|---|---|---|---|
| F01 | Auth | Email/password registration | High | Medium |
| F02 | Auth | Email verification | High | Low |
| F03 | Auth | OAuth social login | Medium | Medium |
| F04 | Auth | Password reset | High | Low |
| F05 | Auth | Session management (JWT) | High | Medium |
| F06 | Auth | Role-based access control | High | Medium |
| F07 | Auth | Profile management | High | Low |
| F08 | Dashboard | Activity overview widget | High | Low |
| F09 | Dashboard | Quick actions | High | Low |
| F10 | Dashboard | Streak display | High | Low |
| F11 | Dashboard | Achievement preview | Medium | Low |
| F12 | Dashboard | Recent activity list | Medium | Low |
| F13 | Subjects | CRUD operations | High | Medium |
| F14 | Subjects | Hierarchical topics | High | Medium |
| F15 | Subjects | Drag-and-drop ordering | Medium | High |
| F16 | Lessons | Rich text editor | High | High |
| F17 | Lessons | Completion tracking | High | Low |
| F18 | Lessons | Bookmarking | High | Low |
| F19 | Lessons | Reading time estimate | Medium | Low |
| F20 | Quizzes | Multiple question types | High | High |
| F21 | Quizzes | Auto-grading | High | Medium |
| F22 | Quizzes | Instant feedback | High | Low |
| F23 | Quizzes | Quiz history | Medium | Medium |
| F24 | Quizzes | Retake mechanism | Medium | Low |
| F25 | Flashcards | CRUD operations | High | Medium |
| F26 | Flashcards | Spaced repetition | High | High |
| F27 | Flashcards | Multiple review modes | Medium | Medium |
| F28 | Flashcards | Deck organization | High | Low |
| F29 | Planner | Calendar view | High | Medium |
| F30 | Planner | AI scheduling | Medium | High |
| F31 | Planner | Task management | High | Medium |
| F32 | Planner | Reminders | High | Medium |
| F33 | Progress | Visual dashboards | High | Medium |
| F34 | Progress | Study time analytics | Medium | Medium |
| F35 | Progress | Streak tracking | High | Low |
| F36 | Progress | Competency heatmaps | Medium | High |
| F37 | AI Tutor | Context-aware chat | High | High |
| F38 | AI Tutor | Streaming responses | High | Medium |
| F39 | AI Tutor | Conversation memory | Medium | Medium |
| F40 | AI Tutor | Practice problem generation | Medium | High |
| F41 | File Library | Upload & organize | Medium | Medium |
| F42 | File Library | Tagging & search | Medium | Medium |
| F43 | File Library | Attachment to lessons | Medium | Low |
| F44 | Notifications | In-app notification center | High | Medium |
| F45 | Notifications | Email notifications | Medium | Medium |
| F46 | Notifications | Push notifications | Low | High |
| F47 | Notifications | Preferences management | Medium | Low |
| F48 | Gamification | XP and leveling | High | Medium |
| F49 | Gamification | Achievement badges | High | Low |
| F50 | Gamification | Daily quests | Medium | Medium |
| F51 | Gamification | Leaderboards | Low | Medium |
| F52 | Admin | User management | High | Medium |
| F53 | Admin | Content management | High | Medium |
| F54 | Admin | Analytics dashboard | High | High |
| F55 | Admin | System health monitoring | Medium | Medium |
| F56 | Search | Global search | High | High |
| F57 | Search | Advanced filters | Medium | Medium |
| F58 | UX | Responsive design | High | High |
| F59 | UX | Dark mode | Medium | Medium |
| F60 | UX | Keyboard navigation | High | Medium |

---

## User Stories

### Authentication
- **US-AUTH-01:** As a new user, I want to create an account with my email and password so that I can access the platform.
- **US-AUTH-02:** As a new user, I want to receive an email verification link so that my account is secure.
- **US-AUTH-03:** As an existing user, I want to log in with my credentials so that I can continue my studies.
- **US-AUTH-04:** As an existing user, I want to reset my password via email so that I can regain access if I forget it.
- **US-AUTH-05:** As a privacy-conscious user, I want to delete my account and all associated data so that I have full control over my information.
- **US-AUTH-06:** As a user, I want to update my profile (name, avatar, preferences) so that the platform feels personal.

### Dashboard
- **US-DASH-01:** As a student, I want to see an overview of my active subjects and upcoming sessions immediately upon login so that I can plan my day.
- **US-DASH-02:** As a student, I want to see my current streak so that I am motivated to maintain consistent study habits.
- **US-DASH-03:** As a student, I want quick links to resume the last lesson or quiz I was working on so that I can get back to studying instantly.

### Subjects & Lessons
- **US-SUBJ-01:** As a student, I want to create and organize subjects so that I can structure my learning by topic.
- **US-SUBJ-02:** As a student, I want to create nested topics inside subjects so that I can break down complex subjects into manageable units.
- **US-LESS-01:** As a student, I want to write rich, formatted lesson notes so that I can capture and review information effectively.
- **US-LESS-02:** As a student, I want to mark lessons as complete so that I can track my progress.
- **US-LESS-03:** As a student, I want to bookmark important lessons so that I can reference them later.

### Quizzes
- **US-QUIZ-01:** As a student, I want to take practice quizzes with multiple question types so that I can test my knowledge.
- **US-QUIZ-02:** As a student, I want immediate feedback after answering a question so that I can learn from my mistakes.
- **US-QUIZ-03:** As a student, I want to review my quiz history so that I can identify patterns in my weaknesses.
- **US-QUIZ-04:** As a student, I want to retake quizzes to reinforce my learning.

### Flashcards
- **US-FLASH-01:** As a student, I want to create flashcards so that I can memorize key concepts.
- **US-FLASH-02:** As a student, I want my flashcards to be scheduled using spaced repetition so that I review them at optimal intervals.
- **US-FLASH-03:** As a student, I want to review flashcards in different modes (flip, type, multiple choice) so that I can strengthen recall in multiple ways.

### Study Planner
- **US-PLAN-01:** As a student, I want to schedule study sessions on a calendar so that I can manage my time effectively.
- **US-PLAN-02:** As a student, I want the platform to suggest optimal study times based on my weak areas so that I can study more efficiently.
- **US-PLAN-03:** As a student, I want reminders before my scheduled sessions so that I don't forget to study.

### Progress Tracking
- **US-PROG-01:** As a student, I want to see a visual breakdown of my mastery by subject so that I understand where to focus my efforts.
- **US-PROG-02:** As a student, I want to track my study time over time so that I can measure my effort.
- **US-PROG-03:** As a student, I want to maintain a daily streak so that I stay motivated.

### AI Tutor
- **US-AI-01:** As a student, I want to ask questions about the current lesson so that I can clarify doubts immediately.
- **US-AI-02:** As a student, I want the AI tutor to use Socratic questioning so that I develop deeper understanding.
- **US-AI-03:** As a student, I want the AI tutor to generate practice problems so that I can apply what I learned.

### Notifications & Gamification
- **US-NOTIF-01:** As a student, I want to receive reminders for upcoming study sessions so that I stay on track.
- **US-NOTIF-02:** As a student, I want to earn XP and badges so that studying feels rewarding.
- **US-NOTIF-03:** As a student, I want daily quests so that I have clear short-term goals.

### Admin
- **US-ADMIN-01:** As an admin, I want to manage users (view, edit roles, suspend, delete) so that I maintain platform integrity.
- **US-ADMIN-02:** As an admin, I want to manage platform content (subjects, lessons, quizzes) so that the learning material is up-to-date.
- **US-ADMIN-03:** As an admin, I want to view platform analytics so that I can make data-driven decisions.

---

## Business Rules

### BR-1: Authentication & Access
- BR-1.1 A user must verify their email before accessing any protected content.
- BR-1.2 Passwords must be at least 12 characters long and pass strength validation.
- BR-1.3 JWT access tokens expire after 15 minutes; refresh tokens expire after 7 days.
- BR-1.4 Users can have one of three roles: student, tutor, admin.
- BR-1.5 Tutors can view assigned students' progress but cannot modify admin settings.
- BR-1.6 Admins have full access to all features and user data.

### BR-2: Subjects & Organization
- BR-2.1 Subjects must have a unique name per user (or globally if public).
- BR-2.2 Topics must belong to exactly one subject.
- BR-2.3 Lessons must belong to exactly one topic.
- BR-2.4 Archiving a subject archives all associated topics, lessons, quizzes, and flashcards.
- BR-2.5 Users can reorder topics and lessons; order persists per user.

### BR-3: Lessons & Notes
- BR-3.1 A lesson marked as complete contributes to subject mastery percentage.
- BR-3.2 Lesson content is versioned; edits create a new version rather than overwriting.
- BR-3.3 Rich text is sanitized on the server to prevent XSS.

### BR-4: Quizzes
- BR-4.1 A quiz has at least one question; maximum 50 questions per quiz for performance.
- BR-4.2 Each question has exactly one correct answer (except multi-select type with 2–5 correct answers).
- BR-4.3 Quizzes auto-save progress; unanswered questions are saved when navigating away.
- BR-4.4 Users may retake quizzes unlimited times.
- BR-4.5 The system tracks attempts per quiz per user.

### BR-5: Flashcards
- BR-5.1 A flashcard deck must have at least one card.
- BR-5.2 Cards scheduled for review are surfaced based on SM-2 algorithm parameters (ease factor, interval, repetitions).
- BR-5.3 Users may manually override scheduled review date.
- BR-5.4 Mastered cards are archived after 4 consecutive "easy" ratings.

### BR-6: Study Planner
- BR-6.1 Study sessions must be between 15 and 180 minutes in duration.
- BR-6.2 Users cannot have overlapping study sessions with the same subject.
- BR-6.3 AI scheduling considers: upcoming deadlines, weak topic mastery, preferred study times, and current streak.

### BR-7: Progress & Gamification
- BR-7.1 XP is awarded for: completing a lesson (+10), passing a quiz (+25), mastering a flashcard deck (+50), completing a study session (+15), maintaining a 7-day streak (+100).
- BR-7.2 Levels are calculated: `level = floor(sqrt(total_xp / 100)) + 1`.
- BR-7.3 Streaks reset if no activity occurs within 24 hours of the last recorded session.
- BR-7.4 Achievements require specific conditions (e.g., "Week Warrior" for 7-day streak, "Quiz Master" for 10 perfect quizzes).
- BR-7.5 Leaderboards display only users who have opted in.

### BR-8: AI Tutor
- BR-8.1 AI responses are limited to 2,048 tokens per turn.
- BR-8.2 AI conversations are scoped to the current subject context unless overridden.
- BR-8.3 AI tutoring is rate-limited to 50 messages per hour per user to manage costs.
- BR-8.4 Sensitive prompts are filtered through moderation guardrails.
- BR-8.5 AI responses include a disclaimer that the content may not be 100% accurate.

### BR-9: Notifications
- BR-9.1 Notifications expire after 30 days to prevent unbounded storage growth.
- BR-9.2 Email notifications are sent for: account verification, password reset, weekly progress summary (opt-in), and study reminders.
- BR-9.3 Push notifications require explicit user opt-in.

### BR-10: Admin & Moderation
- BR-10.1 Admins cannot access user passwords; only Supabase auth can do so.
- BR-10.2 Moderators can flag and remove content that violates community guidelines.
- BR-10.3 All admin actions are logged with timestamp, admin ID, target entity, and action taken.

---

## Product Roadmap

### Phase 1: Foundation (Weeks 1–4)
- Project setup, CI/CD, database schema, authentication, design system
- Core layout shell (navbar, sidebar, routing)
- Dashboard page with widgets

### Phase 2: Core Learning Loop (Weeks 5–8) — MVP
- Subject & topic management
- Lesson creation with rich text editor
- Quiz builder and taker
- Flashcard deck with basic spaced repetition
- Basic progress tracking

### Phase 3: Engagement & Retention (Weeks 9–12)
- Study planner with AI suggestions
- Gamification (XP, levels, badges, streaks)
- AI Tutor integration
- Notification system (in-app and email)

### Phase 4: Power Features (Weeks 13–16)
- Advanced analytics dashboard
- File library with full-text search
- Global search across all content
- Admin dashboard with user and content management
- PWA offline support

### Phase 5: Optimization & Polish (Weeks 17–20)
- Performance optimization
- Accessibility audit and remediation
- Dark mode refinement
- Mobile app shell (if needed)
- Onboarding flow enhancement

### Phase 6: Scale & Expand (Ongoing)
- Multi-language support (i18n)
- Collaborative learning features
- Live sessions and video integration
- Third-party integrations (Google Classroom, Notion API)
- Marketplace for public content
- Mobile native apps (React Native or Flutter)

---

## MVP Definition

The Minimum Viable Product includes the following core capabilities:

**Must Have:**
1. Email/password authentication with email verification
2. Dashboard with subject overview and quick actions
3. Subject and topic creation with drag-and-drop
4. Lesson editor (Markdown with support for images and code blocks)
5. Quiz builder with multiple-choice questions and auto-grading
6. Flashcard deck with basic spaced repetition (review-only; advanced modes deferred)
7. Progress tracking (completed lessons, quiz scores, streak counter)
8. Basic adaptive study suggestions
9. Responsive design for mobile and desktop
10. Admin user management and basic analytics

**Out of Scope for MVP:**
- AI Tutor
- Gamification (XP, badges, leaderboards)
- Advanced flashcard review modes
- File library
- Advanced analytics and reporting
- PWA offline support
- Multi-language support
- Third-party integrations

**Success Criteria for MVP:**
- One beta user (the intended primary student) can complete a full learning cycle: create a subject → write a lesson → take a quiz → review flashcards → see progress.
- All core pages pass Lighthouse audits with scores above 90.
- No critical or high-severity security vulnerabilities in dependency scan.
- Database schema supports all MVP features and is fully migrated.

---

## Future Expansion

### Short-term (3–6 months post-MVP)
- AI Tutor with streaming responses
- Advanced flashcard modes (typing, multi-select)
- File library with drag-and-drop upload
- Email notifications for study reminders
- Browser push notifications

### Mid-term (6–12 months post-MVP)
- Collaborative subjects (multiple learners per subject)
- Live study sessions with whiteboard
- Notion API integration for bidirectional sync
- Google Classroom and LTI integration for school deployments
- Mobile applications (iOS and Android)

### Long-term (12–24 months post-MVP)
- Multi-tenant enterprise deployments with custom branding
- Adaptive learning paths powered by reinforcement learning
- Speech-to-text for lesson input and flashcard reviews
- VR/AR learning modules for STEM subjects
- Marketplace for educators to publish paid courses
- Open API for third-party content services and LMS integration

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **R1:** Scope creep delays MVP delivery | High | High | Strict MVP definition; weekly scope reviews |
| **R2:** AI API costs exceed budget | Medium | High | Rate limiting; request caching; provider fallback |
| **R3:** Database schema changes in production | Medium | High | Versioned migrations; staged rollouts |
| **R4:** Performance issues at scale | Low | High | Proactive performance monitoring; indexing strategy |
| **R5:** Security vulnerability in dependencies | Medium | High | Automated dependency scanning; rapid patch cycle |
| **R6:** User adoption is low | Low | Medium | User feedback loops; iterative UX improvements |
| **R7:** Third-party service outage (Supabase/Vercel) | Low | High | Status monitoring; graceful degradation; backup providers |
| **R8:** Accessibility compliance costs underestimated | Medium | Medium | Early a11y testing; automated contrast/axe checks in CI |
| **R9:** Data privacy concerns (FERPA/COPPA if minors) | Medium | High | Legal review; privacy policy; data minimization |
| **R10:** Rich text editor complexity | Medium | Medium | Evaluate battle-tested libraries (Lexical, Tiptap); don't build from scratch |

---

## Success Metrics

### Activation
- % of registered users who complete onboarding and create their first subject — Target: >85%
- Time from signup to first lesson created — Target: <5 minutes

### Engagement (DAU/MAU)
- Daily Active Users — Baseline tracked from launch
- Weekly Active Users — Baseline tracked from launch
- Average study sessions per week per user — Target: >3
- Average session duration — Target: >20 minutes

### Retention
- Day 1 retention — Target: >60%
- Day 7 retention — Target: >35%
- Day 30 retention — Target: >25%

### Learning Efficacy
- Quizzes completed per user per week — Target: >2
- Flashcard reviews completed per user per week — Target: >10
- Lesson completion rate (started vs. finished) — Target: >70%
- Self-reported confidence improvement — Measured via in-app survey

### Performance
- Web Vitals (LCP, FID, CLS) — Target: 90th percentile "Good"
- API p95 latency — Target: <200ms
- Error rate (client-side) — Target: <0.5%

### Satisfaction
- Net Promoter Score (NPS) — Target: >50
- Support ticket volume relative to active users — Target: <1 per 1,000 DAU

---

## Release Strategy

### Environment Strategy
1. **Local** — Developer machines with local Supabase instance
2. **Development** (`dev.*`) — Shared environment for QA and staging of new features; auto-deploys from `develop` branch
3. **Staging** (`staging.*`) — Production-like environment; manual promotion from `develop` via PR to `staging`
4. **Production** (`*.com`) — Live user-facing environment; pinned releases from `main` branch

### Branching Model
- `main` — Production code; immutable tagged releases
- `staging` — Pre-production release candidate
- `develop` — Integration branch; CI runs on all PRs
- `feature/*` — Feature branches; small, focused, short-lived
- `hotfix/*` — Emergency fixes branch off `main`; merge back to both `main` and `develop`

### Release Cadence
- **MVP Launch:** Single production release when all MVP criteria are met
- **Post-MVP:** Bi-weekly releases to staging; production releases every 2–4 weeks
- **Hotfixes:** As needed; max 24-hour turnaround from report to production

### Rollout Process
1. Code merged to `develop` → CI runs tests, lint, type check
2. Feature flagged changes deployed to `staging` for QA
3. QA sign-off → merge `staging` to `main` → trigger production deploy
4. Use Vercel Preview Deployments for every PR
5. Post-deploy: monitor logs, Sentry errors, and Vercel Analytics for 30 minutes
6. If issues detected: rollback via Vercel or disable feature flags

### Feature Flags
- Laravel-style or LaunchDarkly-style feature flags for incomplete features
- All experimental features gated behind flags
- Flags can be toggled per user role, per environment, or globally

---

## Maintenance Strategy

### Active Maintenance (MVP — 6 months post-launch)
- Daily dependency updates for critical security patches
- Weekly triage of bugs and user feedback
- Bi-weekly minor releases for bug fixes and small improvements
- Monthly security audit (automated tools + manual review)
- Continuous monitoring via Vercel Analytics, Sentry, and Supabase dashboard

### Ongoing Maintenance (post Phase 2)
- Quarterly dependency audits and major version updates
- Performance budget reviews per release
- Accessibility regression testing on every release
- Backup integrity verification weekly
- Database query performance monitoring and index optimization monthly

### Deprecation Policy
- Deprecated features are marked in code with `@deprecated` JSDoc and announced in release notes
- Minimum 6-month deprecation period before removal
- Migration guides provided for breaking changes
- Legacy API versions supported for 12 months

### Documentation Maintenance
- Architecture docs updated with every significant infrastructure change
- Component documentation auto-generated where possible (Storybook or TypeDoc)
- Runbooks maintained for common operational tasks (DB migration, deploy rollback, user data export)
