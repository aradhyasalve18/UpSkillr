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
    const redirectTo = location.state?.from || (role === "instructor" ? "/instructor" : "/dashboard");
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-5 py-16">
      <Link to="/" className="mx-auto mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-600 text-white">
          <GraduationCap size={18} />
        </span>
        <span className="font-display text-xl font-semibold text-ink">UpSkillr</span>
      </Link>

      <div className="rounded-2xl border border-ink/10 bg-canvas-raised p-7 shadow-card">
        <h1 className="font-display text-2xl font-medium text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-faint">Log in to pick up your courses where you left off.</p>

        <RoleToggle role={role} setRole={setRole} />

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Field label="Full name" value={name} onChange={setName} placeholder="Kira Sharma" type="text" />
          <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" required />
          <Field label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" required />

          {error && <p className="text-sm text-clay-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Log in as {role === "instructor" ? "Instructor" : "Learner"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-faint">
          No account yet?{" "}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
            Create one
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint">
        Prototype build — any email/password combination signs you in as the selected role.
      </p>
    </div>
  );
}

export function RoleToggle({ role, setRole }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-canvas-sunken p-1">
      <button
        type="button"
        onClick={() => setRole("learner")}
        className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
          role === "learner" ? "bg-canvas-raised text-indigo-600 shadow-sm" : "text-ink-faint hover:text-ink"
        }`}
      >
        <BookOpen size={14} /> Learner
      </button>
      <button
        type="button"
        onClick={() => setRole("instructor")}
        className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
          role === "instructor" ? "bg-canvas-raised text-indigo-600 shadow-sm" : "text-ink-faint hover:text-ink"
        }`}
      >
        <PenSquare size={14} /> Instructor
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
        className="w-full rounded-lg border border-ink/15 bg-canvas-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo-400"
      />
    </label>
  );
}

function titleCase(s) {
  return s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1));
}
