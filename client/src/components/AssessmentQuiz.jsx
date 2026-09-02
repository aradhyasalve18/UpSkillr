import { FileCheck2 } from "lucide-react";

/**
 * Renders an assessment-type lesson inside the LearningPlayer (FR-04).
 * Owner: Developer 3 (Enrollment & Progress). This is a structural placeholder —
 * wire it up to the real quiz schema (questions, options, scoring) coming from
 * the Course & Lesson module once /api/lessons/:id/assessment exists.
 */
export default function AssessmentQuiz({ lesson }) {
  return (
    <div className="flex aspect-video flex-col items-center justify-center rounded-md border border-border-subtle bg-ink text-white">
      <FileCheck2 size={36} className="mb-3 text-brand-500" />
      <p className="text-sm text-white/80">{lesson?.title || "Assessment"}</p>
      <p className="mt-1 text-xs text-white/50">Quiz questions render here once the assessment schema is wired up.</p>
    </div>
  );
}
