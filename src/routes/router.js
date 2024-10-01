const { Router } = require("express");
const adminRoutes = require("./admin.routes.js");
const studentRoutes = require("./student.routes.js");
const subjectRoutes = require("./subject.routes.js");
const problemRoutes = require("./problem.routes.js");
const teacherRoutes = require("./teacher.routes.js");
const difficultyRoutes = require("./difficulty.routes.js");
const translationRoutes = require("./translation.routes.js");
const router = Router();

router.use("/admins", adminRoutes);
router.use("/students", studentRoutes);
router.use("/problems", problemRoutes);
router.use("/subjects", subjectRoutes);
router.use("/teachers", teacherRoutes);
router.use("/difficulties", difficultyRoutes);
router.use("/translations", translationRoutes);

module.exports = router;
