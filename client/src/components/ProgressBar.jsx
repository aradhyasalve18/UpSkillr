export default function ProgressBar({ percent = 0, tone = "brand", label }) {
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
