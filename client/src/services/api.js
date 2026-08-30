import axios from "axios";

/**
 * Shared Axios instance for all API calls (Dev 4 — Frontend UI/UX Integrator).
 *
 * Base URL points at the Express server (Dev 1's server.js). Set
 * VITE_API_URL in a .env file once the backend is deployed; defaults to the
 * local dev server.
 *
 * Endpoint groups below mirror the agreed REST contract:
 *   /api/auth         — Dev 1 (authRoutes.js)
 *   /api/courses       — Dev 2 (courseRoutes.js)
 *   /api/lessons        — Dev 2 (lessonRoutes.js)
 *   /api/enrollments     — Dev 3 (enrollmentRoutes.js)
 *   /api/admin            — Dev 1 (adminRoutes.js)
 *
 * Every AuthContext function currently backed by localStorage (login, enrol,
 * toggleLesson, createCourse, submitReview, ...) should eventually call the
 * matching function here instead. None of these are wired up yet — that
 * happens once the corresponding backend route exists.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT (once auth is live) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("upskillr_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Auth (Dev 1) ---------------------------------------------------------
export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
};

// --- Courses & Lessons (Dev 2) --------------------------------------------
export const courseApi = {
  list: (params) => api.get("/courses", { params }),
  detail: (slug) => api.get(`/courses/${slug}`),
  create: (payload) => api.post("/courses", payload),
  update: (id, payload) => api.put(`/courses/${id}`, payload),
  publish: (id) => api.patch(`/courses/${id}/publish`),
  addLesson: (courseId, payload) => api.post(`/courses/${courseId}/lessons`, payload),
};

// --- Enrollment & Progress (Dev 3) ----------------------------------------
export const enrollmentApi = {
  enrol: (courseId) => api.post("/enrollments", { courseId }),
  completeLesson: (enrollmentId, lessonId) => api.patch(`/enrollments/${enrollmentId}/lessons/${lessonId}`),
  myEnrollments: () => api.get("/enrollments/me"),
  submitReview: (courseId, payload) => api.post(`/courses/${courseId}/reviews`, payload),
};

// --- Admin (Dev 1) ----------------------------------------------------------
export const adminApi = {
  stats: () => api.get("/admin/stats"),
  activity: () => api.get("/admin/activity"),
};

export default api;
