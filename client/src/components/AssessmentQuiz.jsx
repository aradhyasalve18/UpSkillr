import { useMemo, useState } from "react";
import { CheckCircle2, FileCheck2, RotateCcw } from "lucide-react";

function getQuestions(lesson) {
  const questions = lesson?.questions || lesson?.assessment?.questions || lesson?.content?.questions;
  return Array.isArray(questions) ? questions : [];
}

function getAnswer(question) {
  return question?.correctAnswer ?? question?.correctOptionIndex ?? question?.answer ?? question?.correctOption;
}

function optionValue(option, index) {
  if (option && typeof option === "object") return String(option.id ?? option.value ?? index);
  return String(index);
}

function optionLabel(option) {
  if (option && typeof option === "object") return option.label ?? option.text ?? option.value ?? "";
  return String(option);
}

function isCorrect(question, index) {
  const answer = getAnswer(question);
  if (answer == null) return false;
  const normalizedAnswer = answer && typeof answer === "object"
    ? String(answer.id ?? answer.value ?? answer.label ?? answer.text)
    : String(answer);
  return [String(index), optionValue(question.options[index], index), optionLabel(question.options[index])]
    .includes(normalizedAnswer);
}

export default function AssessmentQuiz({ lesson, onComplete }) {
  const questions = useMemo(() => getQuestions(lesson), [lesson]);
  const contentReady = questions.length > 0 && questions.every((question) =>
    question && typeof question === "object" && (question.prompt || question.question) &&
    Array.isArray(question.options) && question.options.length > 1 && getAnswer(question) != null
  );
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const submit = (event) => {
    event.preventDefault();
    if (!contentReady || questions.some((_, index) => answers[index] == null)) return;

    const score = questions.reduce(
      (total, question, index) => total + Number(isCorrect(question, Number(answers[index]))),
      0
    );
    const nextResult = { score, total: questions.length };
    setResult(nextResult);
    onComplete?.(nextResult);
  };

  const retake = () => {
    setAnswers({});
    setResult(null);
  };

  if (!contentReady) {
    return (
      <div className="rounded-md border border-dashed border-border-subtle bg-surface p-6 text-center">
        <FileCheck2 size={30} className="mx-auto mb-3 text-brand-500" />
        <h2 className="font-display text-lg font-medium text-ink">Assessment content unavailable</h2>
        <p className="mt-2 text-sm text-ink-soft">This lesson does not include complete quiz questions and scoring keys yet.</p>
      </div>
    );
  }

  if (result) {
    return (
      <section className="rounded-md border border-success/20 bg-success/5 p-6" aria-live="polite">
        <CheckCircle2 size={30} className="mb-3 text-success" />
        <h2 className="font-display text-xl font-medium text-ink">Assessment submitted</h2>
        <p className="mt-2 text-sm text-ink-soft">You answered {result.score} of {result.total} correctly.</p>
        <button type="button" onClick={retake} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-900">
          <RotateCcw size={14} /> Try again
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-md border border-border-subtle bg-surface p-5 sm:p-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Knowledge check</p>
        <h2 className="mt-1 font-display text-xl font-medium text-ink">{lesson?.title || "Assessment"}</h2>
      </div>
      {questions.map((question, questionIndex) => (
        <fieldset key={question.id || questionIndex} className="rounded border border-border-subtle p-4">
          <legend className="px-1 text-sm font-medium text-ink">{question.prompt || question.question || `Question ${questionIndex + 1}`}</legend>
          <div className="mt-2 space-y-2">
            {(question.options || []).map((option, optionIndex) => (
              <label key={option.id || optionIndex} className="flex cursor-pointer items-start gap-2.5 rounded px-2 py-2 text-sm text-ink-soft hover:bg-canvas">
                <input
                  type="radio"
                  name={`question-${questionIndex}`}
                  value={optionIndex}
                  checked={answers[questionIndex] === String(optionIndex)}
                  onChange={() => setAnswers((current) => ({ ...current, [questionIndex]: String(optionIndex) }))}
                  className="mt-0.5 accent-[#2F5D8C]"
                />
                <span>{optionLabel(option)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <button type="submit" disabled={questions.some((_, index) => answers[index] == null)} className="rounded bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-40">
        Submit assessment
      </button>
    </form>
  );
}
