import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { COURSES, REVIEWS } from "../data/mockData";

const AuthContext = createContext(null);

const STORAGE_KEY = "upskillr_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // corrupted or unavailable storage — fall through to defaults
  }
  return {
    user: null,
    enrolments: {}, // courseId -> { enrolledAt, completedLessonIds: [] }
    myCourses: [], // instructor-authored course drafts/published (extra to mock data)
    extraReviews: [],
  };
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // storage unavailable (private browsing, quota) — state still works in-memory
    }
  }, [state]);

  const login = useCallback((name, role) => {
    setState((s) => ({
      ...s,
      user: { name, role, email: `${name.toLowerCase().replace(/\s+/g, ".")}@upskillr.dev` },
    }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, user: null }));
  }, []);

  const enrol = useCallback((courseId) => {
    setState((s) => {
      if (s.enrolments[courseId]) return s;
      return {
        ...s,
        enrolments: {
          ...s.enrolments,
          [courseId]: { enrolledAt: new Date().toISOString(), completedLessonIds: [] },
        },
      };
    });
  }, []);

  const toggleLesson = useCallback((courseId, lessonId) => {
    setState((s) => {
      const existing = s.enrolments[courseId];
      if (!existing) return s;
      const has = existing.completedLessonIds.includes(lessonId);
      const completedLessonIds = has
        ? existing.completedLessonIds.filter((id) => id !== lessonId)
        : [...existing.completedLessonIds, lessonId];
      return {
        ...s,
        enrolments: {
          ...s.enrolments,
          [courseId]: { ...existing, completedLessonIds },
        },
      };
    });
  }, []);

  const submitReview = useCallback((courseId, rating, comment, name) => {
    setState((s) => ({
      ...s,
      extraReviews: [
        ...s.extraReviews,
        {
          id: `ur-${Date.now()}`,
          courseId,
          learnerName: name || "You",
          rating,
          comment,
          date: new Date().toISOString().slice(0, 10),
        },
      ],
    }));
  }, []);

  const createCourse = useCallback((course) => {
    setState((s) => ({
      ...s,
      myCourses: [
        ...s.myCourses,
        { ...course, id: `mc-${Date.now()}`, learners: 0, rating: 0, ratingCount: 0, createdAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const updateCourseStatus = useCallback((courseId, status) => {
    setState((s) => ({
      ...s,
      myCourses: s.myCourses.map((c) => (c.id === courseId ? { ...c, status } : c)),
    }));
  }, []);

  const allCourses = useMemo(() => {
    const drafted = state.myCourses.filter((c) => c.status === "published");
    return [...COURSES, ...drafted];
  }, [state.myCourses]);

  const allReviews = useMemo(() => [...REVIEWS, ...state.extraReviews], [state.extraReviews]);

  const progressFor = useCallback(
    (courseId, lessonsCount) => {
      const e = state.enrolments[courseId];
      if (!e) return { percent: 0, completed: 0, isEnrolled: false, completedLessonIds: [] };
      const completed = e.completedLessonIds.length;
      return {
        percent: lessonsCount ? Math.round((completed / lessonsCount) * 100) : 0,
        completed,
        isEnrolled: true,
        completedLessonIds: e.completedLessonIds,
      };
    },
    [state.enrolments]
  );

  const value = {
    user: state.user,
    login,
    logout,
    enrol,
    toggleLesson,
    submitReview,
    createCourse,
    updateCourseStatus,
    myCourses: state.myCourses,
    enrolments: state.enrolments,
    allCourses,
    allReviews,
    progressFor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
