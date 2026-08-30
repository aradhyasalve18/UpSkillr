import { Link } from "react-router-dom";
import { BookOpen, Flame, Trophy, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";

export default function LearnerDashboard() {
  const { user, allCourses, enrolments, progressFor } = useAuth();

  const enrolled = allCourses.filter((c) => enrolments[c.id]);
  const inProgress = enrolled.filter((c) => progressFor(c.id, c.lessonsCount).percent < 100);
  const completed = enrolled.filter((c) => progressFor(c.id, c.lessonsCount).percent === 100);
  const totalLessonsDone = enrolled.reduce((sum, c) => sum + progressFor(c.id, c.lessonsCount).completed, 0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-indigo-600">Learner dashboard</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Welcome back, {user?.name?.split(" ")[0]}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Courses enrolled" value={enrolled.length} tone="indigo" />
        <StatCard icon={Flame} label="Lessons completed" value={totalLessonsDone} tone="marigold" />
        <StatCard icon={Trophy} label="Courses finished" value={completed.length} tone="moss" />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">Continue learning</h2>
          {inProgress.length > 0 && (
            <Link to="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
              Find more courses <ArrowRight size={14} />
            </Link>
          )}
        </div>
        {inProgress.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nothing in progress yet"
            description="Enrol in a course from the catalog and it will show up here, with your progress tracked lesson by lesson."
            action={<Link to="/courses" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Browse courses</Link>}
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

function StatCard({ icon: Icon, label, value, tone }) {
  const toneClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    marigold: "bg-marigold-50 text-marigold-600",
    moss: "bg-moss-50 text-moss-600",
  }[tone];
  return (
    <div className="rounded-xl border border-ink/10 bg-canvas-raised p-5">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses}`}>
        <Icon size={17} />
      </span>
      <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}
