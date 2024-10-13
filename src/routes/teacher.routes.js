const { Router } = require("express");
const teacherController = require("../controllers/teacher.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const teacherRouter = Router();

teacherRouter.post("/login", teacherController.loginTeacher);

teacherRouter.post("/register", authenticate, requireRole(["admin"]), teacherController.registerTeacher);
teacherRouter.put("/update-teacher", authenticate, requireRole(["teacher"]), teacherController.meUpdateTeacher);

teacherRouter.put("/:id", authenticate, requireRole(["admin", "teacher"]), teacherController.updateTeacher);
teacherRouter.delete("/:id", authenticate, requireRole(["admin"]), teacherController.deleteTeacher);

teacherRouter.get("/", authenticate, teacherController.getAllTeachers);
teacherRouter.get("/me", authenticate, teacherController.getMeTeacher);
teacherRouter.get("/:id", authenticate, teacherController.getTeacherById);

module.exports = teacherRouter;
