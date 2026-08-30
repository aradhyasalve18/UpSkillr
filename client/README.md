# UpSkillr — Client

React + Vite + Tailwind frontend (Developer 4's module, per the Implementation Plan), built
against SRS v1.2: role-based auth, course catalog & detail, enrolment, lesson-by-lesson progress
tracking, an instructor course editor, a learner dashboard, an admin console.

Runs entirely on mock data and `localStorage` right now, so it demos fully with no backend
running. `src/services/api.js` is the wired-but-unused Axios contract other devs' routes plug into.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to /dist
npm run preview    # serve that build locally
```

Requires Node 18+.

## What's in here

```
src/
  data/mockData.js          Courses, instructors, reviews — swap for real API responses
  services/api.js           Axios client + endpoint groups matching the REST contract
  context/AuthContext.jsx   Auth, enrolment, progress, course CRUD (localStorage-backed for now)
  components/
    Navbar.jsx / Footer.jsx
    ProtectedRoute.jsx       Role-gated routing (FR-02)
    CourseCard.jsx
    SyllabusPath.jsx          Signature progress-path motif
    ProgressBar.jsx / RatingStars.jsx / EmptyState.jsx
    RatingModal.jsx           Rating & feedback form (FR-09)
    AssessmentQuiz.jsx        Assessment-lesson placeholder (FR-04)
  pages/
    Home.jsx                  Marketing landing
    Login.jsx / Register.jsx  (FR-01)
    CourseCatalog.jsx         Browse + filter + search (FR-05)
    CourseDetail.jsx          Syllabus, enrol, reviews (FR-06, FR-09)
    LearningPlayer.jsx        Lesson player + mark-complete (FR-07)
    LearnerDashboard.jsx      Progress overview (FR-08)
    InstructorDashboard.jsx   Course list + stats (FR-03)
    CourseEditor.jsx          Create/publish flow (FR-03, FR-04)
    AdminDashboard.jsx        Course review + activity feed (FR-10)
    Profile.jsx
```

Any login/register form signs you in as whichever role you pick (Learner / Instructor) — there's
no real backend to check credentials against yet.

## Design notes

- **Palette**: indigo `#2B3A67` (brand), marigold `#E8963B` (progress/achievement), moss `#4B6B4E`
  (completion), on a cool paper canvas `#F5F5F1`.
- **Type**: Fraunces (display) + Inter (UI/body) + IBM Plex Mono (data, timestamps, course codes).
- **Signature motif**: the "syllabus path" — a dashed connecting line with filled/current/empty
  nodes — used in the hero, every course syllabus, the lesson player sidebar, and dashboards.

## Connecting to the real backend

1. `services/api.js` already has `authApi`, `courseApi`, `enrollmentApi`, `adminApi` matching the
   agreed `/api/auth`, `/api/courses`, `/api/lessons`, `/api/enrollments`, `/api/admin` routes.
2. In `context/AuthContext.jsx`, swap the body of `login`, `enrol`, `toggleLesson`, `createCourse`,
   `submitReview` for calls into the matching `services/api.js` function, and store the returned
   JWT (`localStorage.setItem("upskillr_token", token)`) instead of the plain `{name, role}` object.
3. Point `allCourses` / `allReviews` at `courseApi.list()` / the reviews endpoint once they exist,
   instead of the static arrays in `data/mockData.js`.
