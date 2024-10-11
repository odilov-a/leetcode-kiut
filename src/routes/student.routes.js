const { Router } = require("express");
const studentController = require("../controllers/student.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const studentRouter = Router();

studentRouter.post("/login", studentController.loginStudent);
studentRouter.post("/register", studentController.registerStudent);
studentRouter.get("/", authenticate, studentController.getAllStudents);
studentRouter.get("/me", authenticate, studentController.getMeStudent);
studentRouter.get("/top/balance", authenticate, studentController.getTopStudentsByBalance);

studentRouter.get("/:id/attempts", authenticate, studentController.getAttemptByStudentId);
studentRouter.get("/:id", authenticate, studentController.getStudentById);
studentRouter.put("/:id", authenticate, studentController.updateStudent);
studentRouter.delete("/:id", authenticate, studentController.deleteStudent);

module.exports = studentRouter;