import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Compass } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import LearningPlayer from "./pages/LearningPlayer";
import LearnerDashboard from "./pages/LearnerDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import CourseEditor from "./pages/CourseEditor";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<CourseCatalog />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/learn/:slug" element={<LearningPlayer />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute role="learner">
                    <LearnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor"
                element={
                  <ProtectedRoute role="instructor">
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/new"
                element={
                  <ProtectedRoute role="instructor">
                    <CourseEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <Compass size={26} />
      </span>
      <h1 className="font-display text-3xl font-medium text-ink">Off the syllabus</h1>
      <p className="mt-2 text-sm text-ink-soft">This page doesn't exist. Let's get you back on track.</p>
      <Link to="/" className="mt-6 rounded bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-900">
        Back to home
      </Link>
    </div>
  );
}

const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");

function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-sm text-ink-soft">Log in to view your profile.</p>
        <Link to="/login" className="mt-4 inline-block text-sm font-medium text-brand-500">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-brand-500">Account</p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Profile settings</h1>

      <div className="mt-8 rounded-md border border-border-subtle bg-surface p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-xl font-semibold text-white">
            {initials(user.name)}
          </span>
          <div>
            <p className="font-display text-lg font-medium text-ink">{user.name}</p>
            <p className="text-sm text-ink-soft">{user.email}</p>
            <span className="mt-1 inline-block rounded bg-canvas border border-border-subtle px-2.5 py-0.5 text-xs font-medium capitalize text-brand-500">
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-4 border-t border-border-subtle pt-6">
          <ReadOnlyField label="Full name" value={user.name} />
          <ReadOnlyField label="Email" value={user.email} />
          <ReadOnlyField label="Account type" value={user.role} />
        </div>

        <button onClick={logout} className="mt-8 rounded border border-error/30 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10">
          Log out
        </button>
      </div>
      <p className="mt-4 text-xs text-ink-soft">Editable profile fields connect to the account API in the full build.</p>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="rounded bg-canvas px-3.5 py-2.5 text-sm capitalize text-ink-soft">{value}</p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
