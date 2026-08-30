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

  const dashboardPath = user?.role === "instructor" ? "/instructor" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
            <GraduationCap size={18} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">UpSkillr</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/courses" className={({ isActive }) => `text-sm font-medium ${isActive ? "text-indigo-600" : "text-ink-soft hover:text-ink"}`}>
            Explore courses
          </NavLink>
          <NavLink to="/instructor" className={({ isActive }) => `text-sm font-medium ${isActive ? "text-indigo-600" : "text-ink-soft hover:text-ink"}`}>
            Teach on UpSkillr
          </NavLink>
          {user && (
            <NavLink to={dashboardPath} className={({ isActive }) => `text-sm font-medium ${isActive ? "text-indigo-600" : "text-ink-soft hover:text-ink"}`}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-soft hover:text-ink">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Get started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-lg border border-ink/10 py-1.5 pl-1.5 pr-3 hover:bg-canvas-sunken"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {initials(user.name)}
                </span>
                <span className="text-sm font-medium text-ink">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} className="text-ink-faint" />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-ink/10 bg-canvas-raised p-1.5 shadow-raised">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-ink">{user.name}</p>
                    <p className="text-xs capitalize text-ink-faint">{user.role} account</p>
                  </div>
                  <div className="my-1 border-t border-ink/10" />
                  <Link to={dashboardPath} onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-canvas-sunken hover:text-ink">
                    Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-canvas-sunken hover:text-ink">
                    Profile settings
                  </Link>
                  <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-clay-500 hover:bg-clay-400/10">
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-canvas-raised px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/courses" onClick={() => setOpen(false)} className="text-sm font-medium text-ink">Explore courses</Link>
            <Link to="/instructor" onClick={() => setOpen(false)} className="text-sm font-medium text-ink">Teach on UpSkillr</Link>
            {user ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="text-sm font-medium text-ink">Dashboard</Link>
                <Link to="/profile" onClick={() => setOpen(false)} className="text-sm font-medium text-ink">Profile settings</Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-clay-500">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-ink">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-medium text-indigo-600">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
