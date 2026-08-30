import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-canvas-raised">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
                <GraduationCap size={18} />
              </span>
              <span className="font-display text-lg font-semibold text-ink">UpSkillr</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-faint">
              Short courses and skill tracks, built by people who still do the job they're teaching.
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">Learn</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link to="/courses" className="hover:text-ink">Explore courses</Link></li>
              <li><Link to="/register" className="hover:text-ink">Create an account</Link></li>
              <li><Link to="/dashboard" className="hover:text-ink">Your progress</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">Teach</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link to="/instructor" className="hover:text-ink">Instructor dashboard</Link></li>
              <li><Link to="/instructor/new" className="hover:text-ink">Publish a course</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link to="/admin" className="hover:text-ink">Admin console</Link></li>
              <li><span className="text-ink-faint">Accessibility statement</span></li>
              <li><span className="text-ink-faint">Terms &amp; privacy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-ink-faint md:flex-row md:items-center">
          <span>© 2026 UpSkillr. A learning platform prototype.</span>
          <span className="font-mono">EDU-WEB-2026-088</span>
        </div>
      </div>
    </footer>
  );
}
