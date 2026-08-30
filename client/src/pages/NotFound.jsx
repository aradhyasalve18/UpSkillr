import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Compass size={26} />
      </span>
      <h1 className="font-display text-3xl font-medium text-ink">Off the syllabus</h1>
      <p className="mt-2 text-sm text-ink-faint">This page doesn't exist. Let's get you back on track.</p>
      <Link to="/" className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
        Back to home
      </Link>
    </div>
  );
}
