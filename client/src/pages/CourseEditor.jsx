import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, GripVertical, FileText, Video, FileCheck2, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { CATEGORIES } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const STEPS = ["Details", "Curriculum", "Resources", "Review & publish"];
const HERO_COLORS = ["#2B3A67", "#4B6B4E", "#B2661C", "#8493C3", "#A1423A", "#5D8259"];

let uid = 0;
const nextId = () => `new-${Date.now()}-${uid++}`;

export default function CourseEditor() {
  const navigate = useNavigate();
  const { createCourse, updateCourseStatus } = useAuth();
  const [step, setStep] = useState(0);

  const [details, setDetails] = useState({
    title: "",
    tagline: "",
    category: CATEGORIES[0],
    level: "Beginner",
    requirements: "",
    outcomes: "",
  });

  const [lessons, setLessons] = useState([{ id: nextId(), title: "", type: "video", duration: "" }]);
  const [resources, setResources] = useState([]);

  const canProceed = () => {
    if (step === 0) return details.title.trim() && details.tagline.trim();
    if (step === 1) return lessons.every((l) => l.title.trim());
    return true;
  };

  const addLesson = () => setLessons((ls) => [...ls, { id: nextId(), title: "", type: "video", duration: "" }]);
  const removeLesson = (id) => setLessons((ls) => ls.filter((l) => l.id !== id));
  const updateLesson = (id, patch) => setLessons((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const addResource = () => setResources((rs) => [...rs, { id: nextId(), title: "", type: "pdf" }]);
  const removeResource = (id) => setResources((rs) => rs.filter((r) => r.id !== id));
  const updateResource = (id, patch) => setResources((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const buildCoursePayload = () => ({
    title: details.title,
    tagline: details.tagline,
    category: details.category,
    level: details.level,
    slug: details.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    heroColor: HERO_COLORS[Math.floor(Math.random() * HERO_COLORS.length)],
    duration: estimateDuration(lessons),
    lessonsCount: lessons.length,
    language: "English",
    updated: new Date().toISOString().slice(0, 10),
    outcomes: details.outcomes.split("\n").map((s) => s.trim()).filter(Boolean),
    requirements: details.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
    lessons: lessons.map((l, i) => ({ id: l.id, order: i + 1, title: l.title, type: l.type, duration: l.duration || "—" })),
    resources: resources.filter((r) => r.title.trim()).map((r) => ({ title: r.title, type: r.type })),
    instructorId: "in-01",
  });

  const handlePublish = (status) => {
    const course = { ...buildCoursePayload(), status };
    createCourse(course);
    navigate("/instructor");
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Create a course</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">{details.title || "Untitled course"}</h1>

      {/* Stepper */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => i < step && setStep(i)}
            className={`flex shrink-0 items-center gap-2 rounded border px-3.5 py-1.5 text-xs font-medium transition ${
              i === step
                ? "border-brand-500 bg-brand-500 text-white"
                : i < step
                ? "border-success bg-canvas text-success cursor-pointer"
                : "border-border-subtle text-ink-soft"
            }`}
          >
            {i < step ? <Check size={12} /> : <span className="font-mono">{i + 1}</span>}
            {s}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-md border border-border-subtle bg-surface p-6">
        {step === 0 && <DetailsStep details={details} setDetails={setDetails} />}
        {step === 1 && (
          <CurriculumStep lessons={lessons} addLesson={addLesson} removeLesson={removeLesson} updateLesson={updateLesson} />
        )}
        {step === 2 && (
          <ResourcesStep resources={resources} addResource={addResource} removeResource={removeResource} updateResource={updateResource} />
        )}
        {step === 3 && <ReviewStep details={details} lessons={lessons} resources={resources} />}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded border border-border-subtle px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-30"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => canProceed() && setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="inline-flex items-center gap-1.5 rounded bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-900 disabled:opacity-40"
          >
            Continue <ArrowRight size={14} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handlePublish("draft")}
              className="rounded border border-border-subtle px-4 py-2.5 text-sm font-medium text-ink hover:bg-canvas"
            >
              Save as draft
            </button>
            <button
              onClick={() => handlePublish("published")}
              className="rounded bg-success px-4 py-2.5 text-sm font-medium text-white hover:bg-success"
            >
              Publish course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function estimateDuration(lessons) {
  const totalMin = lessons.reduce((sum, l) => sum + (parseInt(l.duration) || 15), 0);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function DetailsStep({ details, setDetails }) {
  const set = (k) => (e) => setDetails((d) => ({ ...d, [k]: e.target.value }));
  return (
    <div className="space-y-5">
      <TextField label="Course title" value={details.title} onChange={set("title")} placeholder="e.g. Systems Design for Backend Engineers" />
      <TextField label="Tagline" value={details.tagline} onChange={set("tagline")} placeholder="One sentence on what a learner walks away able to do" />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Category" value={details.category} onChange={set("category")} options={CATEGORIES} />
        <SelectField label="Level" value={details.level} onChange={set("level")} options={["Beginner", "Intermediate", "Advanced"]} />
      </div>
      <TextArea label="Learning outcomes" value={details.outcomes} onChange={set("outcomes")} placeholder="One outcome per line" rows={4} />
      <TextArea label="Requirements" value={details.requirements} onChange={set("requirements")} placeholder="One requirement per line" rows={3} />
    </div>
  );
}

function CurriculumStep({ lessons, addLesson, removeLesson, updateLesson }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-medium text-ink">Lessons & assessments</h3>
        <span className="font-mono text-xs text-ink-soft">{lessons.length} items</span>
      </div>
      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <div key={lesson.id} className="flex items-start gap-3 rounded border border-border-subtle p-3.5">
            <GripVertical size={16} className="mt-2.5 shrink-0 text-ink-soft" />
            <span className="mt-2.5 shrink-0 font-mono text-xs text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
            <div className="flex-1 space-y-2.5">
              <input
                value={lesson.title}
                onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                placeholder="Lesson title"
                className="w-full rounded-md border border-border-subtle bg-canvas px-3 py-2 text-sm focus:border-brand-500"
              />
              <div className="flex gap-2">
                <select
                  value={lesson.type}
                  onChange={(e) => updateLesson(lesson.id, { type: e.target.value })}
                  className="rounded-md border border-border-subtle bg-canvas px-2.5 py-1.5 text-xs text-ink-soft"
                >
                  <option value="video">Video lesson</option>
                  <option value="assessment">Assessment</option>
                </select>
                <input
                  value={lesson.duration}
                  onChange={(e) => updateLesson(lesson.id, { duration: e.target.value })}
                  placeholder="Duration, e.g. 24m"
                  className="w-32 rounded-md border border-border-subtle bg-canvas px-2.5 py-1.5 text-xs text-ink-soft"
                />
              </div>
            </div>
            <button onClick={() => removeLesson(lesson.id)} disabled={lessons.length === 1} className="mt-2 shrink-0 text-ink-soft hover:text-error disabled:opacity-30">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addLesson} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-900">
        <Plus size={15} /> Add lesson
      </button>
    </div>
  );
}

function ResourcesStep({ resources, addResource, removeResource, updateResource }) {
  return (
    <div>
      <h3 className="mb-1 font-display text-lg font-medium text-ink">Supporting resources</h3>
      <p className="mb-4 text-sm text-ink-soft">Optional — attach reference material learners can download alongside the lessons.</p>
      {resources.length === 0 && (
        <p className="mb-4 rounded border border-dashed border-border-subtle px-4 py-6 text-center text-sm text-ink-soft">
          No resources added yet.
        </p>
      )}
      <div className="space-y-2.5">
        {resources.map((r) => (
          <div key={r.id} className="flex items-center gap-2.5 rounded border border-border-subtle p-3">
            <FileText size={15} className="shrink-0 text-brand-500" />
            <input
              value={r.title}
              onChange={(e) => updateResource(r.id, { title: e.target.value })}
              placeholder="Resource title, e.g. Reference sheet"
              className="flex-1 rounded-md border border-border-subtle bg-canvas px-2.5 py-1.5 text-sm"
            />
            <select
              value={r.type}
              onChange={(e) => updateResource(r.id, { type: e.target.value })}
              className="rounded-md border border-border-subtle bg-canvas px-2 py-1.5 text-xs text-ink-soft"
            >
              <option value="pdf">PDF</option>
              <option value="link">Link</option>
              <option value="csv">Dataset</option>
            </select>
            <button onClick={() => removeResource(r.id)} className="text-ink-soft hover:text-error">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addResource} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-900">
        <Plus size={15} /> Add resource
      </button>
    </div>
  );
}

function ReviewStep({ details, lessons, resources }) {
  return (
    <div>
      <h3 className="mb-4 font-display text-lg font-medium text-ink">Review before publishing</h3>
      <div className="space-y-5 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Course</p>
          <p className="mt-1 font-medium text-ink">{details.title || "Untitled"}</p>
          <p className="text-ink-soft">{details.tagline}</p>
          <p className="mt-1 text-xs text-ink-soft">{details.category} · {details.level}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Curriculum ({lessons.length})</p>
          <ul className="mt-2 space-y-1.5">
            {lessons.map((l, i) => (
              <li key={l.id} className="flex items-center gap-2 text-ink-soft">
                {l.type === "assessment" ? <FileCheck2 size={13} className="text-surface" /> : <Video size={13} className="text-brand-500" />}
                {i + 1}. {l.title || "Untitled lesson"}
              </li>
            ))}
          </ul>
        </div>
        {resources.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Resources ({resources.length})</p>
            <ul className="mt-2 space-y-1.5">
              {resources.map((r) => (
                <li key={r.id} className="text-ink-soft">{r.title || "Untitled resource"}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className="mt-6 rounded bg-canvas px-4 py-3 text-xs text-brand-700">
        Publishing makes this course immediately visible to learners browsing the catalog. Choose "Save as draft" to keep working first.
      </p>
    </div>
  );
}

function TextField({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input {...props} onChange={props.onChange} className="w-full rounded border border-border-subtle bg-canvas px-3.5 py-2.5 text-sm focus:border-brand-500" />
    </label>
  );
}
function TextArea({ label, rows = 3, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <textarea {...props} rows={rows} className="w-full rounded border border-border-subtle bg-canvas px-3.5 py-2.5 text-sm focus:border-brand-500" />
    </label>
  );
}
function SelectField({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <select {...props} className="w-full rounded border border-border-subtle bg-canvas px-3.5 py-2.5 text-sm focus:border-brand-500">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
