const { Router } = require("express");
const problemController = require("../controllers/problem.controller.js");
const solutionController = require("../controllers/solution.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const problemRouter = Router();

problemRouter.get("/", authenticate, requireRole(["teacher", "admin", "student"]), problemController.getAllProblems);
problemRouter.get("/search", authenticate, requireRole(["teacher", "admin", "student"]), problemController.searchProblems);
problemRouter.post("/", authenticate, requireRole(["teacher", "admin"]), problemController.createProblem);

problemRouter.get("/teacher/problems", authenticate, requireRole(["teacher", "admin"]), problemController.getAllProblemsByTeacher);
problemRouter.post("/run", authenticate, requireRole(["student", "teacher", "admin"]), solutionController.testRunCode);

problemRouter.get("/difficulty/:difficulty", authenticate, requireRole(["teacher", "admin", "student"]), problemController.getAllProblemsByDifficulty);
problemRouter.get("/:subject/:difficulty", authenticate, requireRole(["teacher", "admin", "student"]), problemController.getProblemsBySubjectAndDifficulty);
problemRouter.get("/:id", authenticate, requireRole(["teacher", "admin", "student"]), problemController.getProblemById);

problemRouter.put("/:id", authenticate, requireRole(["teacher", "admin"]), problemController.updateProblem);
problemRouter.delete("/:id", authenticate, requireRole(["teacher", "admin"]), problemController.deleteProblem);

problemRouter.post("/:id/submit", authenticate, requireRole(["student", "teacher", "admin"]), solutionController.checkSolution);
problemRouter.get("/:id/solution", authenticate, requireRole(["student", "teacher", "admin"]), solutionController.getSolution);

module.exports = problemRouter;
