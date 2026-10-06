const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  enroll,
  completeLesson,
  myEnrollments,
  submitReview,
} = require("../controllers/enrollmentController");

const router = express.Router();

// Mount at /api/enrollments, matching the agreed REST prefix.
router.post("/", protect, authorize("learner"), enroll);
router.get("/me", protect, authorize("learner"), myEnrollments);
router.patch("/:id/lessons/:lessonId", protect, authorize("learner"), completeLesson);

// Reviews use the existing /api/courses/:courseId/reviews client contract.
// Mount this sub-router at /api/courses in server.js.
const reviewRouter = express.Router();
reviewRouter.post("/:courseId/reviews", protect, authorize("learner"), submitReview);
router.reviewRouter = reviewRouter;

module.exports = router;
