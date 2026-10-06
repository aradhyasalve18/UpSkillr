import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, PlayCircle, FileCheck2, Code2, Cloud, LineChart, PenTool, Briefcase, LayoutGrid } from "lucide-react";
import { COURSES, CATEGORIES, findInstructor } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";


const categoryIcons = {
  "Web Development": Code2,
  "Cloud & DevOps": Cloud,
  "Data & Analytics": LineChart,
  "Design": PenTool,
  "Business & Product": Briefcase,
};

const demoPath = [
  { label: "Lesson 1 — Cloud fundamentals", state: "done" },
  { label: "Lesson 2 — EC2: instances & AMIs", state: "done" },
  { label: "Lesson 3 — EBS volumes & snapshots", state: "current" },
  { label: "Lesson 4 — IAM permission boundaries", state: "todo" },
  { label: "Assessment — Three-tier architecture", state: "todo" },
];

export default function Landing() {
  const { progressFor } = useAuth();
  const navigate = useNavigate();
  const featured = COURSES.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-subtle bg-canvas/30">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-5 py-20 text-center lg:px-8 lg:py-28">
          <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-6xl">
            Learn the skills you need.
            <br />
            <span className="italic text-brand-500">Prove your progress.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft sm:text-xl">
            UpSkillr is a modern learning platform where industry experts publish practical courses.
            Master new technologies, track your journey, and build your career.
          </p>

          <div className="mt-10 w-full max-w-xl">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const q = e.target.elements.query.value;
                navigate(`/courses?query=${encodeURIComponent(q)}`);
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                name="query"
                placeholder="What do you want to learn today?"
                className="w-full rounded-full border border-border-subtle bg-surface py-4 pl-6 pr-32 text-base text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="absolute right-2 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-900"
              >
                Search
              </button>
            </form>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-ink-soft">
              <span>Popular:</span>
              {CATEGORIES.slice(0, 3).map((cat) => (
                <Link key={cat} to={`/courses?category=${encodeURIComponent(cat)}`} className="underline decoration-ink/20 underline-offset-2 hover:text-brand-500">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-16 flex w-full flex-wrap justify-center gap-x-12 gap-y-6 border-t border-border-subtle pt-10">
            <Stat value="24k+" label="active learners" />
            <Stat value="180+" label="published courses" />
            <Stat value={CATEGORIES.length} label="skill categories" />
            <Stat value="4.7/5" label="avg. course rating" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Where to start</p>
            <h2 className="mt-1 font-display text-2xl font-medium text-ink sm:text-3xl">{CATEGORIES.length} categories, taught by people who ship</h2>
          </div>
          <Link to="/courses" className="hidden text-sm font-medium text-brand-500 hover:text-brand-900 sm:flex items-center gap-1">
            View all courses <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat] || LayoutGrid;
            const count = COURSES.filter((c) => c.category === cat).length;
            return (
              <Link
                key={cat}
                to={`/courses?category=${encodeURIComponent(cat)}`}
                className="group flex flex-col rounded-md border border-border-subtle bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-brand-50 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-medium text-ink">{cat}</span>
                <span className="mt-1 font-mono text-xs text-ink-soft">{count} courses</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured courses */}
      <section className="border-y border-border-subtle bg-canvas/60">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Highest rated this term</p>
          <h2 className="mt-1 font-display text-2xl font-medium text-ink sm:text-3xl">Featured courses</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} progress={progressFor(course.id, course.lessonsCount)} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">How it works</p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink sm:text-3xl">From browsing to a finished course</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            { title: "Enrol in one action", body: "Find a course, check the syllabus and outcomes, and enrol without a checkout flow in the way." },
            { title: "Track lesson by lesson", body: "Mark lessons complete as you go. Your dashboard shows exactly where you left off, always." },
            { title: "Finish and rate it", body: "Complete the course, leave a rating and a note for the next learner, and move to what's next." },
          ].map((step, i) => (
            <div key={step.title} className="relative pl-6">
              <span className="absolute left-0 top-1 font-mono text-xs text-brand-500">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-lg font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-md bg-brand-500 p-10 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-medium">Teaching something you're good at?</h2>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Publish lessons, resources and assessments, and see exactly how far your learners get.
            </p>
          </div>
          <Link
            to="/instructor"
            className="inline-flex shrink-0 items-center gap-2 rounded bg-white px-5 py-3 text-sm font-medium text-brand-900 transition hover:bg-brand-50"
          >
            Start creating <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );
}
