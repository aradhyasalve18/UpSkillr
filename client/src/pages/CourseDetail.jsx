import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Clock, Users, BarChart3, Globe, CalendarClock, FileText, Link2, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { findInstructor } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import RatingStars from "../components/RatingStars";
import SyllabusPath from "../components/SyllabusPath";
import ProgressBar from "../components/ProgressBar";
import RatingModal from "../components/RatingModal";

const resourceIcon = { pdf: FileText, link: Link2, csv: FileSpreadsheet };

export default function CourseDetail() {
  const { slug } = useParams();
  const { allCourses, allReviews, user, enrol, progressFor, submitReview } = useAuth();
  const navigate = useNavigate();
  const course = allCourses.find((c) => c.slug === slug);
  const [reviewOpen, setReviewOpen] = useState(false);

  if (!course) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-medium text-ink">Course not found</h1>
        <p className="mt-2 text-sm text-ink-faint">It may have been unpublished. Try browsing the catalog instead.</p>
        <Link to="/courses" className="mt-5 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
          Back to courses
        </Link>
      </div>
    );
  }

  const instructor = findInstructor(course.instructorId);
  const progress = progressFor(course.id, course.lessonsCount);
  const reviews = allReviews.filter((r) => r.courseId === course.id);

  const handleEnrol = () => {
    if (!user) {
      navigate("/login", { state: { from: `/courses/${course.slug}` } });
      return;
    }
    enrol(course.id);
  };

  const handleReview = (rating, comment) => {
    submitReview(course.id, rating, comment, user?.name);
    setReviewOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <section className="border-b border-ink/10" style={{ background: `linear-gradient(160deg, ${course.heroColor} 0%, #171A21 120%)` }}>
        <div className="mx-auto max-w-7xl px-5 py-14 text-white lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
            <Link to="/courses" className="hover:text-white">Courses</Link>
            <span>/</span>
            <span>{course.category}</span>
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-medium leading-tight sm:text-4xl">{course.title}</h1>
          <p className="mt-3 max-w-xl text-white/85">{course.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
            <RatingStars value={course.rating} count={course.ratingCount} />
            <span className="inline-flex items-center gap-1"><Users size={14} /> {course.learners.toLocaleString()} learners</span>
            <span className="inline-flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
            <span className="inline-flex items-center gap-1"><BarChart3 size={14} /> {course.level}</span>
            <span className="inline-flex items-center gap-1"><Globe size={14} /> {course.language}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1fr_360px] lg:px-8">
        {/* Main content */}
        <div className="min-w-0">
          <section>
            <h2 className="font-display text-xl font-medium text-ink">What you'll be able to do</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-moss-500" /> {o}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-ink">Course syllabus</h2>
              <span className="font-mono text-xs text-ink-faint">{course.lessonsCount} lessons · {course.duration}</span>
            </div>
            {progress.isEnrolled && <div className="mb-5"><ProgressBar percent={progress.percent} tone="moss" label="Your progress" /></div>}
            <div className="rounded-xl border border-ink/10 bg-canvas-raised p-5">
              <SyllabusPath
                lessons={course.lessons}
                completedLessonIds={progress.completedLessonIds}
                interactive={progress.isEnrolled}
                onSelect={(lesson) => navigate(`/learn/${course.slug}?lesson=${lesson.id}`)}
              />
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-medium text-ink">Requirements</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
              {course.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          {course.resources?.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-medium text-ink">Resources</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {course.resources.map((r) => {
                  const Icon = resourceIcon[r.type] || FileText;
                  return (
                    <div key={r.title} className="flex items-center gap-2.5 rounded-lg border border-ink/10 bg-canvas-raised px-3.5 py-2.5 text-sm text-ink-soft">
                      <Icon size={15} className="text-indigo-500" /> {r.title}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="mt-10 border-t border-ink/10 pt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-ink">Learner feedback</h2>
              {progress.percent === 100 && (
                <button onClick={() => setReviewOpen((o) => !o)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  {reviewOpen ? "Cancel" : "Rate this course"}
                </button>
              )}
            </div>

            {reviewOpen && (
              <div className="mb-6">
                <RatingModal onSubmit={handleReview} onCancel={() => setReviewOpen(false)} />
              </div>
            )}

            {reviews.length === 0 ? (
              <p className="text-sm text-ink-faint">No reviews yet — be the first to finish and leave one.</p>
            ) : (
              <div className="space-y-5">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-ink/10 pb-5 last:border-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ink">{r.learnerName}</p>
                      <span className="font-mono text-xs text-ink-faint">{r.date}</span>
                    </div>
                    <RatingStars value={r.rating} showValue={false} />
                    <p className="mt-1.5 text-sm text-ink-soft">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sticky enrol card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-ink/10 bg-canvas-raised p-6 shadow-card">
            {progress.isEnrolled ? (
              <>
                <p className="text-sm font-medium text-moss-600">You're enrolled</p>
                <div className="mt-3"><ProgressBar percent={progress.percent} tone="moss" label={`${progress.completed} of ${course.lessonsCount} lessons`} /></div>
                <Link
                  to={`/learn/${course.slug}`}
                  className="mt-5 block w-full rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {progress.percent === 0 ? "Start course" : progress.percent === 100 ? "Review course" : "Continue learning"}
                </Link>
              </>
            ) : (
              <>
                <p className="font-display text-2xl font-semibold text-ink">Free</p>
                <p className="text-xs text-ink-faint">Full access, no time limit</p>
                <button
                  onClick={handleEnrol}
                  className="mt-5 block w-full rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Enrol in one click
                </button>
              </>
            )}

            <div className="mt-5 space-y-2.5 border-t border-ink/10 pt-5 text-sm text-ink-soft">
              <p className="flex items-center gap-2"><Clock size={14} className="text-ink-faint" /> {course.duration} total</p>
              <p className="flex items-center gap-2"><CalendarClock size={14} className="text-ink-faint" /> Updated {course.updated}</p>
              <p className="flex items-center gap-2"><BarChart3 size={14} className="text-ink-faint" /> {course.level} level</p>
            </div>

            {instructor && (
              <div className="mt-5 border-t border-ink/10 pt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">Instructor</p>
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: instructor.avatarColor }}
                  >
                    {instructor.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{instructor.name}</p>
                    <p className="text-xs text-ink-faint">{instructor.title}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-ink-soft">{instructor.bio}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
