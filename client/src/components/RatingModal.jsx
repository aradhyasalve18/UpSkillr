import { useState } from "react";

export default function RatingModal({ onSubmit, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const feedback = comment.trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError("Choose a rating from 1 to 5 stars.");
      return;
    }
    if (!feedback) {
      setError("Write a few words about your experience before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit(rating, feedback);
      setComment("");
    } catch (submitError) {
      setError(submitError?.response?.data?.message || submitError?.message || "Your review could not be submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-border-subtle bg-surface p-5" aria-busy={submitting}>
      <fieldset className="mb-4">
        <legend className="mb-2 text-sm font-medium text-ink">Your rating</legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={rating === n}
              aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
              disabled={submitting}
              onClick={() => setRating(n)}
              className="rounded p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={n <= rating ? "#E8963B" : "none"} stroke="#E8963B" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
      </fieldset>
      <label htmlFor="course-review" className="sr-only">Written feedback</label>
      <textarea
        id="course-review"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        required
        rows={3}
        placeholder="What stood out about this course?"
        disabled={submitting}
        className="w-full rounded border border-border-subtle bg-canvas px-3.5 py-2.5 text-sm focus:border-brand-500"
      />
      {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={submitting} className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900 disabled:cursor-wait disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit feedback"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting} className="rounded px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink disabled:opacity-50">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
