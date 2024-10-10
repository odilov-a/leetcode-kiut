const { Router } = require("express");
const teacherController = require("../controllers/teacher.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const teacherRouter = Router();

teacherRouter.post("/login", teacherController.loginTeacher);
teacherRouter.post("/register", authenticate, teacherController.registerTeacher);
teacherRouter.get("/", authenticate, teacherController.getAllTeachers);
teacherRouter.get("/me", authenticate, teacherController.getMeTeacher);
teacherRouter.get("/:id", authenticate, teacherController.getTeacherById);
teacherRouter.put("/:id", authenticate, teacherController.updateTeacher);
teacherRouter.delete("/:id", authenticate, teacherController.deleteTeacher);

module.exports = teacherRouter;
