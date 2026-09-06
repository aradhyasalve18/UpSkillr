import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, ArrowRight, CheckCircle2, Clock, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import { findInstructor } from "../context/AuthContext";

export default function LearnerDashboard() {
  const { user, allCourses, enrolments, progressFor } = useAuth();
  const [params] = useSearchParams();
  const tab = params.get("tab") || "dashboard";

  const enrolled = allCourses.filter((c) => enrolments[c.id]);
  const inProgress = enrolled.filter((c) => progressFor(c.id, c.lessonsCount).percent < 100);
  const completed = enrolled.filter((c) => progressFor(c.id, c.lessonsCount).percent === 100);
  const totalLessonsDone = enrolled.reduce((sum, c) => sum + progressFor(c.id, c.lessonsCount).completed, 0);
  const totalLessons = enrolled.reduce((sum, c) => sum + c.lessonsCount, 0);

  if (tab === "learning") return <MyLearningView enrolled={enrolled} progressFor={progressFor} />;
  if (tab === "progress") return <ProgressView enrolled={enrolled} progressFor={progressFor} totalLessonsDone={totalLessonsDone} totalLessons={totalLessons} completed={completed} />;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Learner dashboard</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Welcome back, {user?.name?.split(" ")[0]}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Courses enrolled" value={enrolled.length} />
        <StatCard label="Lessons completed" value={totalLessonsDone} />
        <StatCard label="Courses finished" value={completed.length} />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">Continue learning</h2>
          {inProgress.length > 0 && (
            <Link to="/courses" className="text-sm font-medium text-brand-500 hover:text-brand-900 inline-flex items-center gap-1">
              Find more courses <ArrowRight size={14} />
            </Link>
          )}
        </div>
        {inProgress.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nothing in progress yet"
            description="Enrol in a course from the catalog and it will show up here."
            action={<Link to="/courses" className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900">Browse courses</Link>}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {inProgress.map((c) => (
              <CourseCard key={c.id} course={c} progress={progressFor(c.id, c.lessonsCount)} />
            ))}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-medium text-ink">Completed</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {completed.map((c) => (
              <CourseCard key={c.id} course={c} progress={progressFor(c.id, c.lessonsCount)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MyLearningView({ enrolled, progressFor }) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">My Learning</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Your enrolled courses</h1>
      <p className="mt-2 text-sm text-ink-soft">All the courses you've enrolled in. Click any card to continue learning.</p>

      {enrolled.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={BookOpen} title="No courses yet" description="Browse the catalog and enrol to get started." action={<Link to="/courses" className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900">Browse courses</Link>} />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {enrolled.map((c) => {
            const p = progressFor(c.id, c.lessonsCount);
            const instructor = findInstructor(c.instructorId);
            return (
              <Link key={c.id} to={`/learn/${c.slug}`} className="flex items-center gap-5 rounded-md border border-border-subtle bg-surface p-4 transition hover:shadow-card">
                <div className="hidden sm:block h-16 w-24 rounded shrink-0" style={{ background: c.heroColor }} />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">{c.category} · {c.level}</p>
                  <h3 className="font-display text-base font-medium text-ink truncate">{c.title}</h3>
                  <p className="text-xs text-ink-soft mt-0.5">by {instructor?.name || "UpSkillr Instructor"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-medium text-ink">{p.percent}%</p>
                  <p className="text-xs text-ink-soft">{p.completed}/{c.lessonsCount} lessons</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProgressView({ enrolled, progressFor, totalLessonsDone, totalLessons, completed }) {
  const overallPercent = totalLessons > 0 ? Math.round((totalLessonsDone / totalLessons) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Progress</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Your learning progress</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total enrolled" value={enrolled.length} />
        <StatCard label="Completed" value={completed.length} />
        <StatCard label="Lessons done" value={totalLessonsDone} />
        <StatCard label="Overall" value={`${overallPercent}%`} />
      </div>

      {enrolled.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-medium text-ink">Course-by-course breakdown</h2>
          <div className="overflow-x-auto rounded-md border border-border-subtle bg-surface">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-border-subtle bg-canvas text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Lessons done</th>
                  <th className="px-4 py-3 font-semibold">Progress</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {enrolled.map((c) => {
                  const p = progressFor(c.id, c.lessonsCount);
                  const done = p.percent === 100;
                  return (
                    <tr key={c.id} className="hover:bg-canvas/50">
                      <td className="px-4 py-3.5">
                        <Link to={`/courses/${c.slug}`} className="font-medium text-ink hover:text-brand-500">{c.title}</Link>
                        <p className="text-xs text-ink-soft">{c.category}</p>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs">{p.completed} / {c.lessonsCount}</td>
                      <td className="px-4 py-3.5 w-40">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-sm bg-border-subtle overflow-hidden">
                            <div className={`h-full rounded-sm ${done ? "bg-[#26734D]" : "bg-brand-500"}`} style={{ width: `${p.percent}%` }} />
                          </div>
                          <span className="font-mono text-xs text-ink-soft w-8 text-right">{p.percent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {done ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#26734D]/10 px-2.5 py-1 text-xs font-medium text-[#26734D]">
                            <CheckCircle2 size={12} /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-medium text-brand-500">
                            <Clock size={12} /> In progress
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="flex flex-col justify-between rounded-md border border-border-subtle bg-surface p-5 h-full">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-3 font-display text-4xl font-medium text-ink">{value}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-border-subtle bg-surface px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-canvas text-brand-500">
          <Icon size={22} />
        </span>
      )}
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
