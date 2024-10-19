const { Router } = require("express");
const feedbackController = require("../controllers/feedback.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const feedbackRouter = Router();

feedbackRouter.get("/", authenticate, requireRole(["admin"]), feedbackController.getAllFeedbacks);
feedbackRouter.get("/teacher", authenticate, requireRole(["teacher"]), feedbackController.getFeedbacksByTeacherId);
feedbackRouter.get("/student", authenticate, requireRole(["student"]), feedbackController.getFeedbacksByStudentId);
feedbackRouter.post("/", authenticate, requireRole(["admin", "student", "teacher"]), feedbackController.createFeedback);
feedbackRouter.put("/:id", authenticate, requireRole(["admin", "student", "teacher"]), feedbackController.updateFeedback);
feedbackRouter.delete("/:id", authenticate, requireRole(["admin"]), feedbackController.deleteFeedback);

module.exports = feedbackRouter;