const { Router } = require("express");
const projectController = require("../controllers/project.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const projectRouter = Router();

projectRouter.get("/", authenticate, requireRole(["teacher", "admin", "student"]), projectController.getAllProjects);
projectRouter.get("/search", authenticate, requireRole(["teacher", "admin", "student"]), projectController.searchProjects);
projectRouter.post("/", authenticate, requireRole(["teacher", "admin"]), projectController.createProject);

projectRouter.get("/teacher/projects", authenticate, requireRole(["teacher", "admin"]), projectController.getProjectByTeacherId);

projectRouter.get("/:id", authenticate, requireRole(["teacher", "admin", "student"]), projectController.getProjectById);

projectRouter.put("/:id", authenticate, requireRole(["teacher", "admin"]), projectController.updateProject);
projectRouter.delete("/:id", authenticate, requireRole(["teacher", "admin"]), projectController.deleteProject);

module.exports = projectRouter;
