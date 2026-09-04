import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";


const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("");

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenu(false);
    navigate("/");
  };

  const dashboardPath = user?.role === "instructor" ? "/instructor" : user?.role === "admin" ? "/admin" : "/dashboard";

  const getLinks = () => {
    if (!user) return [{ to: "/courses", label: "Discover" }];
    if (user.role === "learner") {
      return [
        { to: "/courses", label: "Discover" },
        { to: "/dashboard", label: "My Learning" },
        { to: "/dashboard", label: "Progress" }
      ];
    }
    if (user.role === "instructor") {
      return [
        { to: "/instructor", label: "Dashboard" },
        { to: "/instructor", label: "My Courses" },
        { to: "/instructor/new", label: "Create Course" },
        { to: "/instructor", label: "Students" }
      ];
    }
    if (user.role === "admin") {
      return [
        { to: "/admin", label: "Admin Dashboard" },
        { to: "/courses", label: "All Courses" }
      ];
    }
    return [];
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border-subtle">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-500 text-white">
            <GraduationCap size={18} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink mt-1">UpSkillr</span>
          {user?.role === "instructor" && (
            <span className="ml-2 rounded bg-canvas px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft border border-border-subtle">
              Instructor
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {getLinks().map((link, i) => (
            <NavLink 
              key={i} 
              to={link.to} 
              className={({ isActive }) => `text-[13px] font-medium tracking-wide ${isActive ? "text-ink" : "text-ink-soft hover:text-ink"}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {!user ? (
            <>
              <Link to="/login" className="text-[13px] font-medium text-ink hover:text-ink-soft">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded bg-brand-500 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-brand-900"
              >
                Get started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded border border-transparent py-1 pl-1 pr-2 hover:bg-canvas transition"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded bg-brand-500 text-[11px] font-semibold text-white">
                  {initials(user.name)}
                </span>
                <span className="text-[13px] font-medium text-ink">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} className="text-ink-soft" />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 rounded border border-border-subtle bg-surface p-1 shadow-card">
                  <div className="px-3 py-2">
                    <p className="text-[13px] font-medium text-ink">{user.name}</p>
                    <p className="text-[11px] uppercase tracking-wide text-ink-soft mt-0.5">{user.role} account</p>
                  </div>
                  <div className="my-1 border-t border-border-subtle" />
                  <Link to="/profile" onClick={() => setMenu(false)} className="block rounded px-3 py-2 text-[13px] text-ink-soft hover:bg-canvas hover:text-ink">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="block w-full rounded px-3 py-2 text-left text-[13px] text-error hover:bg-canvas">
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="p-2 md:hidden text-ink" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border-subtle bg-surface px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {getLinks().map((link, i) => (
              <Link key={i} to={link.to} onClick={() => setOpen(false)} className="text-[13px] font-medium text-ink">
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="text-[13px] font-medium text-ink">Profile</Link>
                <button onClick={handleLogout} className="text-left text-[13px] font-medium text-error mt-2">Log out</button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-border-subtle" />
                <Link to="/login" onClick={() => setOpen(false)} className="text-[13px] font-medium text-ink">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="text-[13px] font-medium text-brand-500">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
