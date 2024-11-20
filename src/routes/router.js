const { Router } = require("express");
const chatRoutes = require("./chat.routes.js");
const adminRoutes = require("./admin.routes.js");
const studentRoutes = require("./student.routes.js");
const subjectRoutes = require("./subject.routes.js");
const problemRoutes = require("./problem.routes.js");
const teacherRoutes = require("./teacher.routes.js");
const projectsRoutes = require("./project.routes.js");
const feedbackRoutes = require("./feedback.routes.js");
const pereviewRoutes = require("./pereview.routes.js");
const statisticsRoutes = require("./statistics.routes.js");
const difficultyRoutes = require("./difficulty.routes.js");
const translationRoutes = require("./translation.routes.js");
const router = Router();

router.use("/chats", chatRoutes);
router.use("/admins", adminRoutes);
router.use("/students", studentRoutes);
router.use("/problems", problemRoutes);
router.use("/subjects", subjectRoutes);
router.use("/teachers", teacherRoutes);
router.use("/projects", projectsRoutes);
router.use("/pereviews", pereviewRoutes);
router.use("/feedbacks", feedbackRoutes);
router.use("/statistics", statisticsRoutes);
router.use("/difficulties", difficultyRoutes);
router.use("/translations", translationRoutes);

module.exports = router;
