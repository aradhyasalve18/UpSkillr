import { Link } from "react-router-dom";
import { ArrowRight, Check, PlayCircle, FileCheck2, Code2, Cloud, LineChart, PenTool, Briefcase, LayoutGrid } from "lucide-react";
import { COURSES, CATEGORIES, findInstructor } from "../data/mockData";
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
  const featured = COURSES.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-indigo-600">
              Skill development, on your schedule
            </span>
            <h1 className="mt-5 font-display text-[2.75rem] font-medium leading-[1.08] tracking-tight text-ink sm:text-6xl">
              Learn the skill.
              <br />
              <span className="italic text-indigo-600">Prove the progress.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-soft">
              UpSkillr is a lightweight learning platform where instructors publish real, practical
              courses, and every lesson you finish moves a visible line forward — not just a percentage.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Browse courses <ArrowRight size={16} />
              </Link>
              <Link
                to="/instructor"
                className="inline-flex items-center gap-2 rounded-lg border border-ink/15 bg-canvas-raised px-5 py-3 text-sm font-medium text-ink transition hover:bg-canvas-sunken"
              >
                Teach on UpSkillr
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-6">
              <Stat value="24k+" label="active learners" />
              <Stat value="180+" label="published courses" />
              <Stat value="6" label="skill categories" />
              <Stat value="4.7/5" label="avg. course rating" />
            </div>
          </div>

          {/* Signature: syllabus path card, made literal in the hero */}
          <div className="relative">
            <div className="rounded-2xl border border-ink/10 bg-canvas-raised p-6 shadow-raised">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">Currently learning</p>
                  <p className="font-display text-base font-medium text-ink">AWS: Cloud Practitioner to Architect</p>
                </div>
                <span className="font-mono text-xs text-moss-600">40%</span>
              </div>
              <ol>
                {demoPath.map((step, i) => (
                  <li key={i} className="path-line relative pb-5 pl-9 last:pb-0">
                    <span
                      className={`absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 node-${step.state}`}
                    >
                      {step.state === "done" ? (
                        <Check size={13} className="text-white" strokeWidth={3} />
                      ) : step.label.startsWith("Assessment") ? (
                        <FileCheck2 size={12} className={step.state === "current" ? "text-white" : "text-ink-faint"} />
                      ) : (
                        <PlayCircle size={12} className={step.state === "current" ? "text-white" : "text-ink-faint"} />
                      )}
                    </span>
                    <span className={`text-sm ${step.state === "todo" ? "text-ink-faint" : "text-ink"}`}>{step.label}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="absolute -bottom-5 -right-5 hidden rounded-xl border border-ink/10 bg-marigold-400 px-4 py-3 text-white shadow-raised sm:block">
              <p className="font-display text-2xl font-semibold leading-none">92%</p>
              <p className="mt-1 text-[11px] text-white/90">learners finish what they start</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-indigo-600">Where to start</p>
            <h2 className="mt-1 font-display text-2xl font-medium text-ink sm:text-3xl">Six categories, taught by people who ship</h2>
          </div>
          <Link to="/courses" className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-700 sm:flex items-center gap-1">
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
                className="group flex flex-col rounded-xl border border-ink/10 bg-canvas-raised p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-card"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-medium text-ink">{cat}</span>
                <span className="mt-1 font-mono text-xs text-ink-faint">{count} courses</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured courses */}
      <section className="border-y border-ink/10 bg-canvas-sunken/60">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-wide text-indigo-600">Highest rated this term</p>
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
        <p className="font-mono text-[11px] uppercase tracking-wide text-indigo-600">How it works</p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink sm:text-3xl">From browsing to a finished course</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            { title: "Enrol in one action", body: "Find a course, check the syllabus and outcomes, and enrol without a checkout flow in the way." },
            { title: "Track lesson by lesson", body: "Mark lessons complete as you go. Your dashboard shows exactly where you left off, always." },
            { title: "Finish and rate it", body: "Complete the course, leave a rating and a note for the next learner, and move to what's next." },
          ].map((step, i) => (
            <div key={step.title} className="relative pl-6">
              <span className="absolute left-0 top-1 font-mono text-xs text-indigo-300">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-lg font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-indigo-600 p-10 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-medium">Teaching something you're good at?</h2>
            <p className="mt-2 max-w-md text-sm text-indigo-100">
              Publish lessons, resources and assessments, and see exactly how far your learners get.
            </p>
          </div>
          <Link
            to="/instructor"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
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
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}
