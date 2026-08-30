import { Check, PlayCircle, FileCheck2 } from "lucide-react";

/**
 * Renders an ordered list of lessons as a threaded "syllabus path":
 * a vertical dashed line connecting node markers per lesson. This is the
 * platform's signature structural device — legitimate here because course
 * content genuinely is sequential (lessons run in a fixed order).
 */
export default function SyllabusPath({ lessons, completedLessonIds = [], currentLessonId, onSelect, interactive = false }) {
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
                <FileCheck2 size={12} className={isCurrent ? "text-white" : "text-ink-faint"} />
              ) : (
                <PlayCircle size={12} className={isCurrent ? "text-white" : "text-ink-faint"} />
              )}
            </span>

            {interactive ? (
              <button
                type="button"
                onClick={() => onSelect?.(lesson)}
                className="group flex w-full items-start justify-between gap-3 rounded-lg -mt-0.5 px-2 py-1 text-left transition hover:bg-indigo-50"
              >
                <span>
                  <span className="block text-[11px] font-mono uppercase tracking-wide text-ink-faint">
                    {lesson.type === "assessment" ? "Assessment" : `Lesson ${lesson.order}`}
                  </span>
                  <span className={`block text-sm font-medium ${isCurrent ? "text-indigo-600" : "text-ink"}`}>
                    {lesson.title}
                  </span>
                </span>
                <span className="mt-3.5 shrink-0 font-mono text-xs text-ink-faint">{lesson.duration}</span>
              </button>
            ) : (
              <div className="-mt-0.5 px-2 py-1">
                <span className="block text-[11px] font-mono uppercase tracking-wide text-ink-faint">
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
