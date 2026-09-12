import { Link } from "react-router-dom";
import { Clock, Users, Star } from "lucide-react";
import { findInstructor } from "../context/AuthContext";
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
      className="group flex flex-col overflow-hidden rounded-md border border-border-subtle bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div
        className="relative flex h-32 items-end p-4"
        style={{ background: `linear-gradient(135deg, ${course.heroColor} 0%, ${course.heroColor}CC 100%)` }}
      >
        <span className="rounded bg-surface/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink ">
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">{course.level}</span>
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

        <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
          <RatingStars value={course.rating} count={course.ratingCount} size={12} />
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
        </div>

        {progress?.isEnrolled ? (
          <div className="mt-3 border-t border-border-subtle pt-3">
            <ProgressBar percent={progress.percent} tone="success" label={progress.percent === 100 ? "Completed" : "Your progress"} />
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-1 border-t border-border-subtle pt-3 text-xs text-ink-soft">
            <Users size={12} /> {course.learners.toLocaleString()} learners enrolled
          </div>
        )}
      </div>
    </Link>
  );
}

function RatingStars({ value = 0, size = 14, showValue = true, count }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} className={i < full ? "fill-brand-500 text-brand-500" : "fill-transparent opacity-30"} strokeWidth={1.5} />
        ))}
      </span>
      {showValue && value > 0 && (
        <span className="font-mono text-xs opacity-90">
          {value.toFixed(1)}
          {count != null && <span className="opacity-60"> ({count.toLocaleString()})</span>}
        </span>
      )}
    </span>
  );
}

function ProgressBar({ percent = 0, tone = "brand", label }) {
  const fillClass = tone === "success" ? "bg-[#26734D]" : "bg-brand-500";
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-ink-soft">{label}</span>
          <span className="font-mono text-xs text-ink-soft">{percent}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-sm bg-border-subtle" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-sm ${fillClass} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
