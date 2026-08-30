import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

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
              <Route path="/admin" element={<AdminDashboard />} />
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
