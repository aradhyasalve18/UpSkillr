# UpSkillr

Online Learning & Skill Development Platform — MERN stack.
Project code `EDU-WEB-2026-088` · SRS v1.2

Full-stack platform where instructors publish courses (lessons, resources,
assessments) and learners browse, enrol in one click, track lesson-by-lesson
progress, and rate completed courses.

## Repo layout

```
UpSkillr/
├── client/     React + Vite + Tailwind frontend (Developer 4 — this part is done)
└── server/     Express + MongoDB API (skeleton only — Developers 1–3)
```

## Team split (per Implementation Plan)

| Dev | Domain | Owns |
|---|---|---|
| **Dev 1** | Backend Core & Auth Lead | `server/config/db.js`, `server/models/User.js`, `server/middleware/*`, `server/controllers/authController.js` + `adminController.js`, `server/routes/authRoutes.js` + `adminRoutes.js`, `server.js` |
| **Dev 2** | Course & Lesson Module Lead | `server/models/Course.js` + `Lesson.js`, `server/controllers/courseController.js` + `lessonController.js`, `server/routes/courseRoutes.js` + `lessonRoutes.js`, `client/src/pages/InstructorDashboard.jsx` + `CourseEditor.jsx` |
| **Dev 3** | Enrollment & Progress Lead | `server/models/Enrollment.js`, `server/controllers/enrollmentController.js`, `server/routes/enrollmentRoutes.js`, `client/src/pages/LearnerDashboard.jsx` + `LearningPlayer.jsx`, `client/src/components/RatingModal.jsx` + `AssessmentQuiz.jsx` |
| **Dev 4** | Frontend UI/UX Integrator | Design system (`index.css`, Tailwind tokens), `client/src/services/api.js`, `Navbar.jsx`, `Footer.jsx`, `ProtectedRoute.jsx`, `CourseCard.jsx`, `Home.jsx`, `CourseCatalog.jsx`, `CourseDetail.jsx`, routing (`App.jsx`) |

`client/` is fully built and runs standalone on mock data — see `client/README.md`.
`server/` is a scaffolded skeleton: real folders and files with header comments
describing what each one needs, ready for Dev 1–3 to fill in.

## Getting started

```bash
# frontend
cd client
npm install
npm run dev          # http://localhost:5173

# backend (once Dev 1–3 have implemented the stubs)
cd server
npm install
cp .env.example .env  # fill in MONGO_URI, JWT_SECRET
npm run dev           # http://localhost:5000
```

## Git branching (per plan)

`main` (production) ← `dev` (integration) ← `feature/dev1-auth`,
`feature/dev2-courses`, `feature/dev3-enrollment`, `feature/dev4-frontend`.

## REST contract (agreed prefixes)

`/api/auth` · `/api/courses` · `/api/lessons` · `/api/enrollments` · `/api/admin`

## Acceptance criteria to validate at integration (AC-01 → AC-06)

See `UpSkillr_Project.pdf` (SRS §6) for the full text — each maps to a
Must/Should requirement and is owned by the developer listed in the table
above.
