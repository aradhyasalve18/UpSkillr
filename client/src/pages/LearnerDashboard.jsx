import { Link } from "react-router-dom";
import { BookOpen, Flame, Trophy, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";


export default function LearnerDashboard() {
  const { user, allCourses, enrolments, progressFor } = useAuth();

  const enrolled = allCourses.filter((c) => enrolments[c.id]);
  const inProgress = enrolled.filter((c) => progressFor(c.id, c.lessonsCount).percent < 100);
  const completed = enrolled.filter((c) => progressFor(c.id, c.lessonsCount).percent === 100);
  const totalLessonsDone = enrolled.reduce((sum, c) => sum + progressFor(c.id, c.lessonsCount).completed, 0);

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
            description="Enrol in a course from the catalog and it will show up here, with your progress tracked lesson by lesson."
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

function StatCard({ label, value }) {
  return (
    <div className="flex flex-col justify-between rounded-md border border-border-subtle bg-surface p-5 h-full">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-3 font-display text-4xl font-medium text-ink">{value}</p>
    </div>
  );
}


// --- INJECTED EmptyState ---
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
