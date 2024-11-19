const { Router } = require("express");
const subjectController = require("../controllers/subject.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const subjectRouter = Router();

subjectRouter.get("/", authenticate, requireRole(["teacher", "admin", "student"]), subjectController.getAllSubjects);

subjectRouter.get("/:id", authenticate, requireRole(["admin"]), subjectController.getSubjectById);
subjectRouter.get("/teacher/subject", authenticate, requireRole(["teacher", "admin"]), subjectController.getAllSubjectsByTeacher);

subjectRouter.post("/", authenticate, requireRole(["admin"]), subjectController.createSubject);
subjectRouter.put("/:id", authenticate, requireRole(["admin"]), subjectController.updateSubject);
subjectRouter.delete("/:id", authenticate, requireRole(["admin"]), subjectController.deleteSubject);

module.exports = subjectRouter;
