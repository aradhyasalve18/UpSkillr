import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { RoleToggle, Field } from "./Login";


export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("learner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Fill in your name, email, and a password to create an account.");
      return;
    }
    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    login(name, role);
    navigate(role === "instructor" ? "/instructor" : role === "admin" ? "/admin" : "/dashboard", { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center px-5 py-16">
      <div className="grid w-full overflow-hidden rounded-md border border-border-subtle bg-surface shadow-card lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-brand-500 p-10 text-white lg:flex">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15">
              <GraduationCap size={18} />
            </span>
            <span className="font-display text-xl font-semibold">UpSkillr</span>
          </Link>
          <div>
            <h2 className="font-display text-2xl font-medium leading-snug">
              Every lesson you finish is one node further along the path.
            </h2>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {[
                "Free to enrol in any published course",
                "Progress tracked automatically, lesson by lesson",
                "Rate and review once you've completed a course",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/60">EDU-WEB-2026-088 · UpSkillr platform</p>
        </div>

        <div className="p-8 sm:p-10">
          <h1 className="font-display text-2xl font-medium text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink-soft">Choose how you'll use UpSkillr — you can teach and learn with separate accounts.</p>

          <RoleToggle role={role} setRole={setRole} />

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Field label="Full name" value={name} onChange={setName} placeholder="Kira Sharma" required />
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" required />
            <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="At least 8 characters" required />

            {error && <p className="text-sm text-error">{error}</p>}

            <button
              type="submit"
              className="w-full rounded bg-brand-500 py-2.5 text-sm font-medium text-white transition hover:bg-brand-900"
            >
              Create {role} account
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-500 hover:text-brand-900">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
