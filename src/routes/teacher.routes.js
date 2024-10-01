const { Router } = require("express");
const teacherController = require("../controllers/teacher.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const teacherRouter = Router();

teacherRouter.post("/login", teacherController.loginTeacher);
teacherRouter.get("/", authenticate, teacherController.getAllTeachers);
teacherRouter.get("/:id", authenticate, teacherController.getTeacherById);
teacherRouter.post("/register", authenticate, teacherController.registerTeacher);
teacherRouter.post("/me", authenticate, teacherController.getMeTeacher);
teacherRouter.put("/:id", authenticate, teacherController.updateTeacher);
teacherRouter.delete("/:id", authenticate, teacherController.deleteTeacher);

module.exports = teacherRouter;
