import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-sm text-ink-soft">Log in to view your profile.</p>
        <Link to="/login" className="mt-4 inline-block text-sm font-medium text-brand-500">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Account</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Profile settings</h1>

      <div className="mt-8 rounded-md border border-border-subtle bg-surface p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-xl font-semibold text-white">
            {initials(user.name)}
          </span>
          <div>
            <p className="font-display text-lg font-medium text-ink">{user.name}</p>
            <p className="text-sm text-ink-soft">{user.email}</p>
            <span className="mt-1 inline-block rounded bg-canvas border border-border-subtle px-2.5 py-0.5 text-xs font-medium capitalize text-brand-500">
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-4 border-t border-border-subtle pt-6">
          <ReadOnlyField label="Full name" value={user.name} />
          <ReadOnlyField label="Email" value={user.email} />
          <ReadOnlyField label="Account type" value={user.role} />
        </div>

        <button onClick={logout} className="mt-8 rounded border border-error/30 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10">
          Log out
        </button>
      </div>
      <p className="mt-4 text-xs text-ink-soft">Editable profile fields connect to the account API in the full build.</p>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="rounded bg-canvas px-3.5 py-2.5 text-sm capitalize text-ink-soft">{value}</p>
    </div>
  );
}
