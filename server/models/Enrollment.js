const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    completedLessonIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
      default: [],
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
    feedback: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// A learner can only have one enrollment per course. The controller also
// handles duplicate-key races by returning the existing enrollment.
enrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

enrollmentSchema.methods.percentComplete = function percentComplete(totalLessons) {
  if (!Number.isFinite(totalLessons) || totalLessons <= 0) return 0;
  return Math.min(100, Math.round((this.completedLessonIds.length / totalLessons) * 100));
};

module.exports = mongoose.model("Enrollment", enrollmentSchema);
