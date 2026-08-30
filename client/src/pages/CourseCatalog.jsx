import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const SORTS = [
  { id: "popular", label: "Most popular" },
  { id: "rating", label: "Highest rated" },
  { id: "newest", label: "Newest" },
];

export default function Catalog() {
  const { allCourses, progressFor } = useAuth();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = params.get("category") || "";
  const activeLevel = params.get("level") || "";
  const sort = params.get("sort") || "popular";

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const filtered = useMemo(() => {
    let list = allCourses.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.tagline.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !activeCategory || c.category === activeCategory;
      const matchesLevel = !activeLevel || c.level === activeLevel;
      return matchesQuery && matchesCategory && matchesLevel;
    });

    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") list = [...list].sort((a, b) => new Date(b.updated) - new Date(a.updated));
    else list = [...list].sort((a, b) => b.learners - a.learners);

    return list;
  }, [allCourses, query, activeCategory, activeLevel, sort]);

  const clearAll = () => {
    setParams({});
    setQuery("");
  };

  const hasFilters = activeCategory || activeLevel || query;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-wide text-indigo-600">Catalog</p>
        <h1 className="mt-1 font-display text-3xl font-medium text-ink">Explore courses</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          {allCourses.length} courses across {CATEGORIES.length} categories, taught by working practitioners.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        {/* Filters sidebar */}
        <aside className={`lg:w-64 lg:shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="rounded-xl border border-ink/10 bg-canvas-raised p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-ink">Filters</h2>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  Clear all
                </button>
              )}
            </div>

            <FilterGroup label="Category">
              {CATEGORIES.map((cat) => (
                <FilterOption
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => setParam("category", activeCategory === cat ? "" : cat)}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Level">
              {LEVELS.map((lvl) => (
                <FilterOption
                  key={lvl}
                  label={lvl}
                  active={activeLevel === lvl}
                  onClick={() => setParam("level", activeLevel === lvl ? "" : lvl)}
                />
              ))}
            </FilterGroup>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses by title or topic"
                className="w-full rounded-lg border border-ink/15 bg-canvas-raised py-2.5 pl-10 pr-4 text-sm focus:border-indigo-400"
              />
            </div>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/15 bg-canvas-raised px-4 py-2.5 text-sm font-medium text-ink lg:hidden"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="rounded-lg border border-ink/15 bg-canvas-raised px-3 py-2.5 text-sm text-ink"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {query && <Chip label={`"${query}"`} onRemove={() => setQuery("")} />}
              {activeCategory && <Chip label={activeCategory} onRemove={() => setParam("category", "")} />}
              {activeLevel && <Chip label={activeLevel} onRemove={() => setParam("level", "")} />}
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No courses match those filters"
              description="Try a different keyword, or clear the filters to see everything UpSkillr offers."
              action={
                <button onClick={clearAll} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  Clear filters
                </button>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} progress={progressFor(course.id, course.lessonsCount)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function FilterOption({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 text-left text-sm transition ${
        active ? "bg-indigo-50 font-medium text-indigo-600" : "text-ink-soft hover:bg-canvas-sunken"
      }`}
    >
      {label}
    </button>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 py-1 pl-3 pr-1.5 text-xs font-medium text-indigo-600">
      {label}
      <button onClick={onRemove} className="rounded-full p-0.5 hover:bg-indigo-100">
        <X size={12} />
      </button>
    </span>
  );
}
