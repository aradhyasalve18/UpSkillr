export default function ProgressBar({ percent = 0, tone = "indigo", label }) {
  const fillClass = tone === "moss" ? "bg-moss-500" : tone === "marigold" ? "bg-marigold-400" : "bg-indigo-600";
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-ink-faint">{label}</span>
          <span className="font-mono text-xs text-ink-soft">{percent}%</span>
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-full ${fillClass} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
