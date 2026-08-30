import { useState } from "react";
import { Users, BookOpen, Activity, ShieldCheck, TrendingUp, Search } from "lucide-react";
import { COURSES, INSTRUCTORS } from "../data/mockData";
import RatingStars from "../components/RatingStars";

const ACTIVITY = [
  { id: 1, actor: "Meera Kulkarni", action: "published", target: "React for Production", time: "2h ago" },
  { id: 2, actor: "Aditya S.", action: "enrolled in", target: "AWS: Cloud Practitioner to Architect", time: "3h ago" },
  { id: 3, actor: "Rohan Deshpande", action: "updated", target: "Kubernetes for Application Teams", time: "6h ago" },
  { id: 4, actor: "Fatima R.", action: "completed", target: "AWS: Cloud Practitioner to Architect", time: "1d ago" },
  { id: 5, actor: "Priya Nair", action: "published", target: "API Design & Authentication", time: "2d ago" },
  { id: 6, actor: "Devansh K.", action: "left a review on", target: "Applied Data Analysis with Python", time: "3d ago" },
];

export default function Admin() {
  const [query, setQuery] = useState("");
  const filtered = COURSES.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  const totalLearners = COURSES.reduce((s, c) => s + c.learners, 0);
  const avgRating = (COURSES.reduce((s, c) => s + c.rating, 0) / COURSES.length).toFixed(2);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-indigo-600">Admin console</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Platform overview</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={BookOpen} label="Published courses" value={COURSES.length} />
        <Stat icon={Users} label="Registered learners" value={totalLearners.toLocaleString()} />
        <Stat icon={ShieldCheck} label="Active instructors" value={INSTRUCTORS.length} />
        <Stat icon={TrendingUp} label="Avg. course rating" value={avgRating} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-medium text-ink">Course review</h2>
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses"
                className="rounded-lg border border-ink/15 bg-canvas-raised py-2 pl-8 pr-3 text-sm focus:border-indigo-400"
              />
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-canvas-raised">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas-sunken text-xs uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3.5 font-medium text-ink">{c.title}</td>
                    <td className="px-4 py-3.5 text-ink-faint">{c.category}</td>
                    <td className="px-4 py-3.5"><RatingStars value={c.rating} showValue={false} size={12} /></td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-moss-50 px-2.5 py-1 text-xs font-medium text-moss-600">Live</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-medium text-ink">Recent activity</h2>
          <div className="rounded-xl border border-ink/10 bg-canvas-raised p-5">
            <ul className="space-y-4">
              {ACTIVITY.map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Activity size={12} />
                  </span>
                  <p className="text-ink-soft">
                    <span className="font-medium text-ink">{a.actor}</span> {a.action}{" "}
                    <span className="font-medium text-ink">{a.target}</span>
                    <span className="ml-1.5 font-mono text-xs text-ink-faint">{a.time}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-canvas-raised p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon size={17} />
      </span>
      <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}
