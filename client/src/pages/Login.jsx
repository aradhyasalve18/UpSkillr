import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, PenSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("learner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter both an email and a password to continue.");
      return;
    }
    const displayName = name || email.split("@")[0].replace(/[._]/g, " ");
    login(titleCase(displayName), role);
    const redirectTo = location.state?.from || (role === "instructor" ? "/instructor" : role === "admin" ? "/admin" : "/dashboard");
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-5 py-16">
      <Link to="/" className="mx-auto mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-500 text-white">
          <GraduationCap size={18} />
        </span>
        <span className="font-display text-xl font-semibold text-ink">UpSkillr</span>
      </Link>

      <div className="rounded-md border border-border-subtle bg-surface p-7 shadow-card">
        <h1 className="font-display text-2xl font-medium text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-soft">Log in to pick up your courses where you left off.</p>

        {location.state?.enforceRole ? (
          <div className="mt-5 rounded bg-canvas p-3 text-center text-sm font-medium text-brand-500">
            Signing in as Learner
          </div>
        ) : (
          <RoleToggle role={role} setRole={setRole} />
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Field label="Full name" value={name} onChange={setName} placeholder="Kira Sharma" type="text" />
          <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" required />
          <Field label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" required />

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            className="w-full rounded bg-brand-500 py-2.5 text-sm font-medium text-white transition hover:bg-brand-900"
          >
            Log in as {role === "instructor" ? "Instructor" : role === "admin" ? "Admin" : "Learner"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          No account yet?{" "}
          <Link to="/register" state={location.state} className="font-medium text-brand-500 hover:text-brand-900">
            Create one
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        Prototype build — any email/password combination signs you in as the selected role.
      </p>
    </div>
  );
}

export function RoleToggle({ role, setRole }) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-2 rounded bg-canvas p-1">
      <button
        type="button"
        onClick={() => setRole("learner")}
        className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
          role === "learner" ? "bg-surface text-brand-500 shadow-sm" : "text-ink-soft hover:text-ink"
        }`}
      >
        <BookOpen size={14} /> Learner
      </button>
      <button
        type="button"
        onClick={() => setRole("instructor")}
        className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
          role === "instructor" ? "bg-surface text-brand-500 shadow-sm" : "text-ink-soft hover:text-ink"
        }`}
      >
        <PenSquare size={14} /> Instructor
      </button>
      <button
        type="button"
        onClick={() => setRole("admin")}
        className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
          role === "admin" ? "bg-surface text-brand-500 shadow-sm" : "text-ink-soft hover:text-ink"
        }`}
      >
        <BookOpen size={14} /> Admin
      </button>
    </div>
  );
}

export function Field({ label, value, onChange, type = "text", placeholder, required }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-border-subtle bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand-500"
      />
    </label>
  );
}

function titleCase(s) {
  return s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1));
}
