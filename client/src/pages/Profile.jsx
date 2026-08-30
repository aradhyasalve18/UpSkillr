import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-sm text-ink-faint">Log in to view your profile.</p>
        <Link to="/login" className="mt-4 inline-block text-sm font-medium text-indigo-600">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-indigo-600">Account</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Profile settings</h1>

      <div className="mt-8 rounded-xl border border-ink/10 bg-canvas-raised p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white">
            {initials(user.name)}
          </span>
          <div>
            <p className="font-display text-lg font-medium text-ink">{user.name}</p>
            <p className="text-sm text-ink-faint">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium capitalize text-indigo-600">
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-4 border-t border-ink/10 pt-6">
          <ReadOnlyField label="Full name" value={user.name} />
          <ReadOnlyField label="Email" value={user.email} />
          <ReadOnlyField label="Account type" value={user.role} />
        </div>

        <button onClick={logout} className="mt-8 rounded-lg border border-clay-400/30 px-4 py-2.5 text-sm font-medium text-clay-500 hover:bg-clay-400/10">
          Log out
        </button>
      </div>
      <p className="mt-4 text-xs text-ink-faint">Editable profile fields connect to the account API in the full build.</p>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="rounded-lg bg-canvas-sunken px-3.5 py-2.5 text-sm capitalize text-ink-soft">{value}</p>
    </div>
  );
}
