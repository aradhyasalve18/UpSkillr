import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, PlayCircle, PanelLeftClose, PanelLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SyllabusPath from "../components/SyllabusPath";
import ProgressBar from "../components/ProgressBar";
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
        <Link to="/courses" className="mt-4 inline-block text-sm font-medium text-indigo-600">Back to catalog</Link>
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
        className={`shrink-0 overflow-y-auto border-r border-ink/10 bg-canvas-raised transition-all ${
          sidebarOpen ? "w-80 p-5" : "w-0 p-0"
        }`}
      >
        {sidebarOpen && (
          <>
            <Link to={`/courses/${course.slug}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-faint hover:text-ink">
              <ArrowLeft size={13} /> Back to overview
            </Link>
            <h2 className="mt-3 font-display text-base font-medium leading-snug text-ink">{course.title}</h2>
            <div className="mt-3"><ProgressBar percent={progress.percent} tone="moss" label={`${progress.completed} of ${course.lessonsCount} complete`} /></div>
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
              className="rounded-lg border border-ink/10 p-2 text-ink-faint hover:bg-canvas-sunken"
              aria-label="Toggle syllabus"
            >
              {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
            </button>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
              {currentLesson.type === "assessment" ? "Assessment" : `Lesson ${currentLesson.order} of ${course.lessonsCount}`}
            </span>
          </div>

          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">{currentLesson.title}</h1>
          <p className="mt-2 text-sm text-ink-faint">{currentLesson.duration}</p>

          {/* Lesson content surface */}
          {currentLesson.type === "assessment" ? (
            <div className="mt-8">
              <AssessmentQuiz lesson={currentLesson} />
            </div>
          ) : (
            <div className="mt-8 flex aspect-video items-center justify-center rounded-xl border border-ink/10 bg-ink text-white">
              <div className="text-center">
                <PlayCircle size={44} className="mx-auto mb-3 text-white/80" />
                <p className="text-sm text-white/70">Lesson video renders here</p>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-ink/10 bg-canvas-raised p-5 text-sm leading-relaxed text-ink-soft">
            {currentLesson.summary ||
              "This lesson walks through the concept step by step, with the working example built live so you can follow along and reproduce it yourself."}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
            <button
              onClick={handleToggle}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isDone ? "bg-moss-50 text-moss-600 hover:bg-moss-100" : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              {isDone ? "Marked complete" : "Mark as complete"}
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && goTo(prevLesson)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm font-medium text-ink disabled:opacity-30"
              >
                <ArrowLeft size={14} /> Previous
              </button>
              {nextLesson ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Next lesson <ArrowRight size={14} />
                </button>
              ) : (
                <Link
                  to={`/courses/${course.slug}`}
                  onClick={() => !isDone && toggleLesson(course.id, currentLesson.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-moss-500 px-3.5 py-2.5 text-sm font-medium text-white hover:bg-moss-600"
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
