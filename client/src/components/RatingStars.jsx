import { Star } from "lucide-react";

export default function RatingStars({ value = 0, size = 14, showValue = true, count }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < full ? "fill-marigold-400 text-marigold-400" : "fill-transparent text-ink/20"}
            strokeWidth={1.5}
          />
        ))}
      </span>
      {showValue && value > 0 && (
        <span className="font-mono text-xs text-ink-soft">
          {value.toFixed(1)}
          {count != null && <span className="text-ink-faint"> ({count.toLocaleString()})</span>}
        </span>
      )}
    </span>
  );
}
