const { Router } = require("express");
const subjectController = require("../controllers/subject.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const subjectRouter = Router();

subjectRouter.get("/", authenticate, subjectController.getAllSubjects);
subjectRouter.get("/teacher/:id", authenticate, subjectController.getAllSubjectsByTeacher);
subjectRouter.get("/:id", authenticate, subjectController.getSubjectById);

subjectRouter.post("/", authenticate, requireRole(["admin"]), subjectController.createSubject);
subjectRouter.put("/:id", authenticate, requireRole(["admin"]), subjectController.updateSubject);
subjectRouter.delete("/:id", authenticate, requireRole(["admin"]), subjectController.deleteSubject);

module.exports = subjectRouter;
