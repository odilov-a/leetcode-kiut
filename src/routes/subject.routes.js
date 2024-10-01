const { Router } = require("express");
const subjectController = require("../controllers/subject.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const subjectRouter = Router();

subjectRouter.get("/", subjectController.getAllSubjects);
subjectRouter.get("/:id", subjectController.getSubjectById);
subjectRouter.post("/", authenticate, subjectController.createSubject);
subjectRouter.put("/:id", authenticate, subjectController.updateSubject);
subjectRouter.delete("/:id", authenticate, subjectController.deleteSubject);

module.exports = subjectRouter;
