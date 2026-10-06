import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert } from "lucide-react";


export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
          <ShieldAlert size={26} />
        </span>
        <h1 className="font-display text-2xl font-semibold text-ink">Access refused</h1>
        <p className="mt-2 text-sm text-ink-soft">
          This area is for {role} accounts. You're signed in as a {user.role}, so this action isn't available to you.
        </p>
      </div>
    );
  }

  return children;
}
