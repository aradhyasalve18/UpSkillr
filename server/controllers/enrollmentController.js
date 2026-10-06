const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function learnerIdFromRequest(req) {
  return req.user?._id || req.user?.id;
}

function isValidId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

async function enroll(req, res, next) {
  try {
    const learnerId = learnerIdFromRequest(req);
    const { courseId } = req.body || {};
    if (!learnerId || !isValidId(learnerId)) throw httpError(401, "Authentication required.");
    if (!courseId || !isValidId(courseId)) throw httpError(400, "A valid courseId is required.");

    const course = await Course.findById(courseId);
    if (!course || course.status !== "published") throw httpError(404, "Published course not found.");

    let enrollment = await Enrollment.findOne({ learnerId, courseId });
    if (!enrollment) {
      try {
        enrollment = await Enrollment.create({ learnerId, courseId });
      } catch (error) {
        // The unique learner/course index makes repeated one-click requests safe,
        // including two requests arriving at the same time.
        if (error.code !== 11000) throw error;
        enrollment = await Enrollment.findOne({ learnerId, courseId });
      }
    }

    const totalLessons = await Lesson.countDocuments({ courseId });
    res.status(200).json({
      enrollment,
      progressPercent: enrollment.percentComplete(totalLessons),
      totalLessons,
    });
  } catch (error) {
    next(error);
  }
}

async function completeLesson(req, res, next) {
  try {
    const learnerId = learnerIdFromRequest(req);
    const { id: enrollmentId, lessonId } = req.params;
    if (!learnerId || !isValidId(learnerId)) throw httpError(401, "Authentication required.");
    if (!isValidId(enrollmentId) || !isValidId(lessonId)) throw httpError(400, "Invalid enrollment or lesson id.");

    const enrollment = await Enrollment.findOne({ _id: enrollmentId, learnerId });
    if (!enrollment) throw httpError(404, "Enrollment not found.");

    const lesson = await Lesson.findOne({ _id: lessonId, courseId: enrollment.courseId }).select("_id");
    if (!lesson) throw httpError(404, "Lesson not found in this course.");

    if (!enrollment.completedLessonIds.some((id) => id.equals(lesson._id))) {
      enrollment.completedLessonIds.push(lesson._id);
    }
    const totalLessons = await Lesson.countDocuments({ courseId: enrollment.courseId });
    const progressPercent = enrollment.percentComplete(totalLessons);
    enrollment.completedAt = progressPercent === 100 ? enrollment.completedAt || new Date() : null;
    await enrollment.save();

    res.json({ enrollment, progressPercent, totalLessons });
  } catch (error) {
    next(error);
  }
}

async function myEnrollments(req, res, next) {
  try {
    const learnerId = learnerIdFromRequest(req);
    if (!learnerId || !isValidId(learnerId)) throw httpError(401, "Authentication required.");

    const enrollments = await Enrollment.find({ learnerId }).populate("courseId").sort({ enrolledAt: -1 });
    const results = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = await Lesson.countDocuments({ courseId: enrollment.courseId?._id || enrollment.courseId });
        return {
          ...enrollment.toObject(),
          progressPercent: enrollment.percentComplete(totalLessons),
          totalLessons,
        };
      })
    );
    res.json(results);
  } catch (error) {
    next(error);
  }
}

async function submitReview(req, res, next) {
  try {
    const learnerId = learnerIdFromRequest(req);
    const { courseId } = req.params;
    const rating = Number(req.body?.rating);
    const feedback = typeof req.body?.comment === "string" ? req.body.comment.trim() : "";
    if (!learnerId || !isValidId(learnerId)) throw httpError(401, "Authentication required.");
    if (!isValidId(courseId)) throw httpError(400, "Invalid course id.");
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw httpError(400, "Rating must be a whole number from 1 to 5.");
    if (!feedback) throw httpError(400, "Review feedback is required.");

    const enrollment = await Enrollment.findOne({ learnerId, courseId });
    if (!enrollment) throw httpError(403, "Enroll in the course before reviewing it.");
    const totalLessons = await Lesson.countDocuments({ courseId });
    if (totalLessons === 0 || enrollment.percentComplete(totalLessons) < 100) {
      throw httpError(403, "Complete the course before reviewing it.");
    }
    if (enrollment.rating != null) throw httpError(409, "You have already reviewed this course.");

    enrollment.rating = rating;
    enrollment.feedback = feedback;
    await enrollment.save();
    res.status(201).json({ enrollment });
  } catch (error) {
    next(error);
  }
}

module.exports = { enroll, completeLesson, myEnrollments, submitReview };
