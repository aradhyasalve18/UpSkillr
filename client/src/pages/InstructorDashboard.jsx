import { Link } from "react-router-dom";
import { PlusCircle, Users, Star, BookOpen, Pencil, Eye, FileClock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { INSTRUCTORS } from "../context/AuthContext";


export default function InstructorDashboard() {
  const { user, myCourses } = useAuth();

  // Demo instructor profile — a real deployment scopes this to the logged-in instructor's own record.
  const demoInstructor = INSTRUCTORS[0];
  const demoCourses = demoInstructor.courseIds.length;

  const published = myCourses.filter((c) => c.status === "published");
  const drafts = myCourses.filter((c) => c.status !== "published");

  const totalLearners = published.reduce((s, c) => s + (c.learners || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Instructor dashboard</p>
          <h1 className="mt-1 font-display text-3xl font-medium text-ink">Hi {user?.name?.split(" ")[0]}, here's your teaching activity</h1>
        </div>
        <Link
          to="/instructor/new"
          className="inline-flex items-center gap-2 rounded bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-900"
        >
          <PlusCircle size={16} /> New course
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Published courses" value={demoCourses + published.length} />
        <Stat label="Total learners" value={(12925 + totalLearners).toLocaleString()} />
        <Stat label="Average rating" value="4.75" />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-medium text-ink">Your courses</h2>
        <div className="overflow-hidden rounded-md border border-border-subtle bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Learners</th>
                <th className="px-5 py-3 font-medium">Rating</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {demoInstructor.courseIds.map((cid) => (
                <DemoRow key={cid} courseId={cid} />
              ))}
              {[...published, ...drafts].map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{c.title}</p>
                    <p className="text-xs text-ink-soft">{c.category} · {c.level}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-4 font-mono text-ink-soft">{c.learners || 0}</td>
                  <td className="px-5 py-4 font-mono text-ink-soft">{c.rating ? c.rating.toFixed(1) : "—"}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                      <Pencil size={13} /> Edit
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myCourses.length === 0 && (
          <p className="mt-3 text-xs text-ink-soft">
            Rows above with real edit access are courses you create. Sample rows show how published courses with analytics will appear.
          </p>
        )}
      </section>
    </div>
  );
}

function DemoRow({ courseId }) {
  const course = { id: courseId };
  const data = SAMPLE[courseId];
  if (!data) return null;
  return (
    <tr>
      <td className="px-5 py-4">
        <p className="font-medium text-ink">{data.title}</p>
        <p className="text-xs text-ink-soft">{data.category} · {data.level}</p>
      </td>
      <td className="px-5 py-4"><StatusBadge status="published" /></td>
      <td className="px-5 py-4 font-mono text-ink-soft">{data.learners.toLocaleString()}</td>
      <td className="px-5 py-4 font-mono text-ink-soft">{data.rating}</td>
      <td className="px-5 py-4 text-right">
        <Link to={`/courses/${data.slug}`} className="inline-flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-900">
          <Eye size={13} /> View
        </Link>
      </td>
    </tr>
  );
}

// Lightweight lookup so the demo instructor row doesn't need a full data import cycle.
const SAMPLE = {
  "c-01": { title: "React for Production", category: "Web Development", level: "Intermediate", learners: 4821, rating: "4.8", slug: "react-for-production" },
  "c-05": { title: "Advanced CSS & Layout Systems", category: "Web Development", level: "Intermediate", learners: 1980, rating: "4.5", slug: "advanced-css-and-layout-systems" },
};

function StatusBadge({ status }) {
  const map = {
    published: "border border-success text-success",
    draft: "border border-border-subtle bg-canvas text-ink-soft",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${map[status] || map.draft}`}>
      {status === "published" ? <Eye size={11} /> : <FileClock size={11} />}
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

function Stat({ label, value }) {
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
