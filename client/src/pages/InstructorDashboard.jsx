import { Link, useSearchParams } from "react-router-dom";
import { PlusCircle, Users, Eye, Pencil, FileClock, Trash2, BookOpen, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { INSTRUCTORS, COURSES, findInstructor } from "../context/AuthContext";

export default function InstructorDashboard() {
  const { user, myCourses, allCourses, enrolments, progressFor, updateCourseStatus } = useAuth();
  const [params] = useSearchParams();
  const tab = params.get("tab") || "dashboard";

  const demoInstructor = INSTRUCTORS[0];
  const published = myCourses.filter((c) => c.status === "published");
  const drafts = myCourses.filter((c) => c.status !== "published");
  const allInstructorCourses = [...demoInstructor.courseIds.map(id => COURSES.find(c => c.id === id)).filter(Boolean), ...myCourses];
  const totalLearners = allInstructorCourses.reduce((s, c) => s + (c.learners || 0), 0);

  if (tab === "courses") return <MyCoursesView myCourses={myCourses} demoInstructor={demoInstructor} updateCourseStatus={updateCourseStatus} />;
  if (tab === "students") return <StudentsView allCourses={allCourses} enrolments={enrolments} progressFor={progressFor} myCourses={myCourses} demoInstructor={demoInstructor} />;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Instructor dashboard</p>
          <h1 className="mt-1 font-display text-3xl font-medium text-ink">Hi {user?.name?.split(" ")[0]}, here's your teaching activity</h1>
        </div>
        <Link to="/instructor/new" className="inline-flex items-center gap-2 rounded bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-900">
          <PlusCircle size={16} /> New course
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Published courses" value={demoInstructor.courseIds.length + published.length} />
        <Stat label="Total learners" value={totalLearners.toLocaleString()} />
        <Stat label="Average rating" value="4.75" />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-medium text-ink">Your courses</h2>
        <CourseTable demoInstructor={demoInstructor} myCourses={[...published, ...drafts]} />
      </section>
    </div>
  );
}

function MyCoursesView({ myCourses, demoInstructor, updateCourseStatus }) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">My Courses</p>
          <h1 className="mt-1 font-display text-3xl font-medium text-ink">Manage your courses</h1>
          <p className="mt-2 text-sm text-ink-soft">View, edit, or manage the status of courses you've created.</p>
        </div>
        <Link to="/instructor/new" className="inline-flex items-center gap-2 rounded bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-900">
          <PlusCircle size={16} /> New course
        </Link>
      </div>

      {myCourses.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={BookOpen} title="No courses created yet" description="Create your first course to start teaching on UpSkillr." action={<Link to="/instructor/new" className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900">Create course</Link>} />
          <div className="mt-8">
            <h2 className="mb-4 font-display text-lg font-medium text-ink">Sample published courses</h2>
            <CourseTable demoInstructor={demoInstructor} myCourses={[]} />
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {myCourses.map((c) => (
            <div key={c.id} className="rounded-md border border-border-subtle bg-surface p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg font-medium text-ink">{c.title}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{c.category} · {c.level} · {c.lessons?.length || 0} lessons</p>
                  {c.tagline && <p className="mt-2 text-sm text-ink-soft">{c.tagline}</p>}
                  {c.lessons && c.lessons.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft mb-1">Lesson content:</p>
                      <ol className="list-decimal list-inside text-sm text-ink-soft space-y-0.5">
                        {c.lessons.slice(0, 5).map((l, i) => <li key={i}>{l.title} ({l.duration})</li>)}
                        {c.lessons.length > 5 && <li className="text-ink-soft">...and {c.lessons.length - 5} more</li>}
                      </ol>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {c.status === "draft" && (
                    <button onClick={() => updateCourseStatus(c.id, "published")} className="rounded border border-[#26734D]/30 px-3 py-1.5 text-xs font-medium text-[#26734D] hover:bg-[#26734D]/10">
                      Publish
                    </button>
                  )}
                  {c.status === "published" && (
                    <button onClick={() => updateCourseStatus(c.id, "draft")} className="rounded border border-border-subtle px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-canvas">
                      Unpublish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StudentsView({ allCourses, enrolments, progressFor, myCourses, demoInstructor }) {
  // Gather all enrolled students across all courses
  const enrolledData = [];
  const relevantCourseIds = [...demoInstructor.courseIds, ...myCourses.map(c => c.id)];

  for (const course of allCourses) {
    if (!relevantCourseIds.includes(course.id)) continue;
    const e = enrolments[course.id];
    if (e) {
      const p = progressFor(course.id, course.lessonsCount);
      enrolledData.push({ course, progress: p, enrolledAt: e.enrolledAt });
    }
  }

  // Also show demo data for sample courses
  const demoStudents = [
    { name: "Aditya S.", course: "React for Production", progress: 78, lessons: "7/9" },
    { name: "Fatima R.", course: "AWS: Cloud Practitioner to SA", progress: 100, lessons: "11/11" },
    { name: "Nikhil P.", course: "React for Production", progress: 55, lessons: "5/9" },
    { name: "Sara T.", course: "Advanced CSS & Layout", progress: 100, lessons: "6/6" },
    { name: "Devansh K.", course: "React for Production", progress: 33, lessons: "3/9" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Students</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Enrolled students</h1>
      <p className="mt-2 text-sm text-ink-soft">See who has enrolled in your courses and track their progress.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Total students" value={demoStudents.length + enrolledData.length} />
        <Stat label="Active learners" value={demoStudents.filter(s => s.progress < 100).length + enrolledData.filter(e => e.progress.percent < 100).length} />
        <Stat label="Completions" value={demoStudents.filter(s => s.progress === 100).length + enrolledData.filter(e => e.progress.percent === 100).length} />
      </div>

      <div className="mt-10 overflow-x-auto rounded-md border border-border-subtle bg-surface">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-border-subtle bg-canvas text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-semibold">Student</th>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Progress</th>
              <th className="px-4 py-3 font-semibold">Lessons</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {enrolledData.map((e, i) => (
              <tr key={`real-${i}`} className="hover:bg-canvas/50">
                <td className="px-4 py-3.5">
                  <p className="font-medium text-ink">You (enrolled)</p>
                  <p className="text-xs text-ink-soft">Enrolled {new Date(e.enrolledAt).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-3.5 text-ink">{e.course.title}</td>
                <td className="px-4 py-3.5 w-32">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-sm bg-border-subtle overflow-hidden">
                      <div className={`h-full rounded-sm ${e.progress.percent === 100 ? "bg-[#26734D]" : "bg-brand-500"}`} style={{ width: `${e.progress.percent}%` }} />
                    </div>
                    <span className="font-mono text-xs w-8 text-right">{e.progress.percent}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-ink-soft">{e.progress.completed}/{e.course.lessonsCount}</td>
                <td className="px-4 py-3.5">
                  <StatusPill done={e.progress.percent === 100} />
                </td>
              </tr>
            ))}
            {demoStudents.map((s, i) => (
              <tr key={`demo-${i}`} className="hover:bg-canvas/50">
                <td className="px-4 py-3.5">
                  <p className="font-medium text-ink">{s.name}</p>
                </td>
                <td className="px-4 py-3.5 text-ink">{s.course}</td>
                <td className="px-4 py-3.5 w-32">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-sm bg-border-subtle overflow-hidden">
                      <div className={`h-full rounded-sm ${s.progress === 100 ? "bg-[#26734D]" : "bg-brand-500"}`} style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="font-mono text-xs w-8 text-right">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-ink-soft">{s.lessons}</td>
                <td className="px-4 py-3.5">
                  <StatusPill done={s.progress === 100} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseTable({ demoInstructor, myCourses }) {
  return (
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
          {demoInstructor.courseIds.map((cid) => {
            const data = SAMPLE[cid];
            if (!data) return null;
            return (
              <tr key={cid}>
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
          })}
          {myCourses.map((c) => (
            <tr key={c.id}>
              <td className="px-5 py-4">
                <p className="font-medium text-ink">{c.title}</p>
                <p className="text-xs text-ink-soft">{c.category} · {c.level}</p>
              </td>
              <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
              <td className="px-5 py-4 font-mono text-ink-soft">{c.learners || 0}</td>
              <td className="px-5 py-4 font-mono text-ink-soft">{c.rating ? c.rating.toFixed(1) : "—"}</td>
              <td className="px-5 py-4 text-right">
                <span className="inline-flex items-center gap-1 text-xs text-ink-soft"><Pencil size={13} /> Edit</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SAMPLE = {
  "c-01": { title: "React for Production", category: "Web Development", level: "Intermediate", learners: 4821, rating: "4.8", slug: "react-for-production" },
  "c-05": { title: "Advanced CSS & Layout Systems", category: "Web Development", level: "Intermediate", learners: 1980, rating: "4.5", slug: "advanced-css-and-layout-systems" },
};

function StatusBadge({ status }) {
  const cls = status === "published" ? "border border-[#26734D] text-[#26734D]" : "border border-border-subtle bg-canvas text-ink-soft";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {status === "published" ? <Eye size={11} /> : <FileClock size={11} />}
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

function StatusPill({ done }) {
  return done ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#26734D]/10 px-2.5 py-1 text-xs font-medium text-[#26734D]">Completed</span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-medium text-brand-500">In progress</span>
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

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-border-subtle bg-surface px-6 py-14 text-center">
      {Icon && <span className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-canvas text-brand-500"><Icon size={22} /></span>}
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
