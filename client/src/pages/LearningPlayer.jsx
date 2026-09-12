import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, PlayCircle, PanelLeftClose, PanelLeft, Check, FileCheck2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AssessmentQuiz from "../components/AssessmentQuiz";


export default function Learn() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { allCourses, user, progressFor, toggleLesson, enrol } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const course = allCourses.find((c) => c.slug === slug);
  const progress = progressFor(course?.id, course?.lessonsCount);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: `/learn/${slug}` } });
    }
  }, [user, navigate, slug]);

  useEffect(() => {
    if (course && user && !progress.isEnrolled) {
      enrol(course.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id, user]);

  const lessonIdParam = params.get("lesson");
  const currentLesson = useMemo(() => {
    if (!course) return null;
    if (lessonIdParam) return course.lessons.find((l) => l.id === lessonIdParam) || course.lessons[0];
    const firstIncomplete = course.lessons.find((l) => !progress.completedLessonIds.includes(l.id));
    return firstIncomplete || course.lessons[0];
  }, [course, lessonIdParam, progress.completedLessonIds]);

  if (!course) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-medium text-ink">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block text-sm font-medium text-brand-500">Back to catalog</Link>
      </div>
    );
  }
  if (!currentLesson) return null;

  const idx = course.lessons.findIndex((l) => l.id === currentLesson.id);
  const isDone = progress.completedLessonIds.includes(currentLesson.id);
  const prevLesson = course.lessons[idx - 1];
  const nextLesson = course.lessons[idx + 1];

  const goTo = (lesson) => setParams({ lesson: lesson.id });

  const handleToggle = () => toggleLesson(course.id, currentLesson.id);

  const handleNext = () => {
    if (!isDone) toggleLesson(course.id, currentLesson.id);
    if (nextLesson) goTo(nextLesson);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside
        className={`shrink-0 overflow-y-auto border-r border-border-subtle bg-surface transition-all ${
          sidebarOpen ? "w-80 p-5" : "w-0 p-0"
        }`}
      >
        {sidebarOpen && (
          <>
            <Link to={`/courses/${course.slug}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-ink">
              <ArrowLeft size={13} /> Back to overview
            </Link>
            <h2 className="mt-3 font-display text-base font-medium leading-snug text-ink">{course.title}</h2>
            <div className="mt-3"><ProgressBar percent={progress.percent} tone="success" label={`${progress.completed} of ${course.lessonsCount} complete`} /></div>
            <div className="mt-6">
              <SyllabusPath
                lessons={course.lessons}
                completedLessonIds={progress.completedLessonIds}
                currentLessonId={currentLesson.id}
                interactive
                onSelect={goTo}
              />
            </div>
          </>
        )}
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="rounded border border-border-subtle p-2 text-ink-soft hover:bg-canvas"
              aria-label="Toggle syllabus"
            >
              {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
            </button>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              {currentLesson.type === "assessment" ? "Assessment" : `Lesson ${currentLesson.order} of ${course.lessonsCount}`}
            </span>
          </div>

          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">{currentLesson.title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{currentLesson.duration}</p>

          {/* Lesson content surface */}
          {currentLesson.type === "assessment" ? (
            <div className="mt-8">
              <AssessmentQuiz lesson={currentLesson} />
            </div>
          ) : (
            <div className="mt-8 flex aspect-video items-center justify-center rounded-md border border-border-subtle bg-ink text-white">
              <div className="text-center">
                <PlayCircle size={44} className="mx-auto mb-3 text-white/80" />
                <p className="text-sm text-white/70">Lesson video renders here</p>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-md border border-border-subtle bg-surface p-5 text-sm leading-relaxed text-ink-soft">
            {currentLesson.summary ||
              "This lesson walks through the concept step by step, with the working example built live so you can follow along and reproduce it yourself."}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6">
            <button
              onClick={handleToggle}
              className={`inline-flex items-center gap-2 rounded px-4 py-2.5 text-sm font-medium transition ${
                isDone ? "bg-canvas border border-success text-success hover:bg-surface" : "bg-brand-500 text-white hover:bg-brand-900"
              }`}
            >
              {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              {isDone ? "Marked complete" : "Mark as complete"}
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && goTo(prevLesson)}
                className="inline-flex items-center gap-1.5 rounded border border-border-subtle px-3.5 py-2.5 text-sm font-medium text-ink disabled:opacity-30"
              >
                <ArrowLeft size={14} /> Previous
              </button>
              {nextLesson ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 rounded bg-brand-500 px-3.5 py-2.5 text-sm font-medium text-white hover:bg-brand-900"
                >
                  Next lesson <ArrowRight size={14} />
                </button>
              ) : (
                <Link
                  to={`/courses/${course.slug}`}
                  onClick={() => !isDone && toggleLesson(course.id, currentLesson.id)}
                  className="inline-flex items-center gap-1.5 rounded bg-success px-3.5 py-2.5 text-sm font-medium text-white hover:bg-success"
                >
                  Finish course <CheckCircle2 size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- INJECTED ProgressBar ---
function ProgressBar({ percent = 0, tone = "brand", label }) {
  const fillClass = tone === "success" ? "bg-success" : "bg-brand-500";
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-ink-soft">{label}</span>
          <span className="font-mono text-xs text-ink-soft">{percent}%</span>
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-sm bg-border-subtle"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-sm ${fillClass} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}


// --- INJECTED SyllabusPath ---

/**
 * Renders an ordered list of lessons as a threaded "syllabus path":
 * a vertical dashed line connecting node markers per lesson. This is the
 * platform's signature structural device — legitimate here because course
 * content genuinely is sequential (lessons run in a fixed order).
 */
function SyllabusPath({ lessons, completedLessonIds = [], currentLessonId, onSelect, interactive = false }) {
  const firstIncompleteId = lessons.find((l) => !completedLessonIds.includes(l.id))?.id;

  return (
    <ol>
      {lessons.map((lesson) => {
        const done = completedLessonIds.includes(lesson.id);
        const isCurrent = currentLessonId ? currentLessonId === lesson.id : lesson.id === firstIncompleteId;
        const state = done ? "done" : isCurrent ? "current" : "todo";

        return (
          <li key={lesson.id} className="path-line pb-6 pl-9 relative last:pb-0">
            <span
              className={`absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 node-${state}`}
              aria-hidden="true"
            >
              {done ? (
                <Check size={13} className="text-white" strokeWidth={3} />
              ) : lesson.type === "assessment" ? (
                <FileCheck2 size={12} className={isCurrent ? "text-white" : "text-ink-soft"} />
              ) : (
                <PlayCircle size={12} className={isCurrent ? "text-white" : "text-ink-soft"} />
              )}
            </span>

            {interactive ? (
              <button
                type="button"
                onClick={() => onSelect?.(lesson)}
                className="group flex w-full items-start justify-between gap-3 rounded -mt-0.5 px-2 py-1 text-left transition hover:bg-canvas"
              >
                <span>
                  <span className="block text-[11px] font-mono uppercase tracking-wide text-ink-soft">
                    {lesson.type === "assessment" ? "Assessment" : `Lesson ${lesson.order}`}
                  </span>
                  <span className={`block text-sm font-medium ${isCurrent ? "text-brand-500" : "text-ink"}`}>
                    {lesson.title}
                  </span>
                </span>
                <span className="mt-3.5 shrink-0 font-mono text-xs text-ink-soft">{lesson.duration}</span>
              </button>
            ) : (
              <div className="-mt-0.5 px-2 py-1">
                <span className="block text-[11px] font-mono uppercase tracking-wide text-ink-soft">
                  {lesson.type === "assessment" ? "Assessment" : `Lesson ${lesson.order}`}
                </span>
                <span className="block text-sm font-medium text-ink">{lesson.title}</span>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
