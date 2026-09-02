import { useState } from "react";

/**
 * Rating & feedback form shown once a learner has completed a course (FR-09).
 * Owner: Developer 3 (Enrollment & Progress). Currently writes to AuthContext's
 * in-memory/localStorage review list — swap `onSubmit` for a POST to
 * /api/courses/:id/reviews once the enrollment service is live.
 */
export default function RatingModal({ onSubmit, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(rating, comment);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-border-subtle bg-surface p-5">
      <p className="mb-2 text-sm font-medium text-ink">Your rating</p>
      <div className="mb-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} className="p-0.5" aria-label={`${n} stars`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={n <= rating ? "#E8963B" : "none"} stroke="#E8963B" strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        rows={3}
        placeholder="What stood out about this course?"
        className="w-full rounded border border-border-subtle bg-canvas px-3.5 py-2.5 text-sm focus:border-brand-500"
      />
      <div className="mt-3 flex gap-2">
        <button type="submit" className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900">
          Submit feedback
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
