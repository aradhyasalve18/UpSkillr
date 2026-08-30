export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-ink/15 bg-canvas-raised px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Icon size={22} />
        </span>
      )}
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-faint">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
