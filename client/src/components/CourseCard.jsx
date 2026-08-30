import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { findInstructor } from "../data/mockData";
import RatingStars from "./RatingStars";
import ProgressBar from "./ProgressBar";

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

export default function CourseCard({ course, progress }) {
  const instructor = findInstructor(course.instructorId);

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-canvas-raised shadow-card transition hover:-translate-y-0.5 hover:shadow-raised"
    >
      <div
        className="relative flex h-32 items-end p-4"
        style={{ background: `linear-gradient(135deg, ${course.heroColor} 0%, ${course.heroColor}CC 100%)` }}
      >
        <span className="rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-white backdrop-blur-sm">
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">{course.level}</span>
        <h3 className="mt-1 font-display text-lg font-medium leading-snug text-ink">{course.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{course.tagline}</p>

        <div className="mt-3 flex items-center gap-2">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: instructor?.avatarColor || "#2B3A67" }}
          >
            {instructor ? initials(instructor.name) : "?"}
          </span>
          <span className="text-xs text-ink-soft">{instructor?.name || "UpSkillr Instructor"}</span>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
          <RatingStars value={course.rating} count={course.ratingCount} size={12} />
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
        </div>

        {progress?.isEnrolled ? (
          <div className="mt-3 border-t border-ink/10 pt-3">
            <ProgressBar percent={progress.percent} tone="moss" label={progress.percent === 100 ? "Completed" : "Your progress"} />
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-1 border-t border-ink/10 pt-3 text-xs text-ink-faint">
            <Users size={12} /> {course.learners.toLocaleString()} learners enrolled
          </div>
        )}
      </div>
    </Link>
  );
}
