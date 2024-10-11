const { Router } = require("express");
const problemController = require("../controllers/problem.controller.js");
const solutionController = require("../controllers/solution.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const problemRouter = Router();

problemRouter.get("/", authenticate, problemController.getAllProblems);
problemRouter.get("/difficulty/:difficulty", authenticate, problemController.getAllProblemsByDifficulty);
problemRouter.get("/subject/:subject", authenticate, problemController.getAllProblemsBySubject);
problemRouter.get("/search", authenticate, problemController.searchProblems);
problemRouter.get("/:subject/:difficulty", authenticate, problemController.getProblemsBySubjectAndDifficulty);
problemRouter.get("/:id", authenticate, problemController.getProblemById);
problemRouter.get("/teacher/:teacher", authenticate, problemController.getAllProblemsByTeacher);
problemRouter.post("/", authenticate, problemController.createProblem);
problemRouter.put("/:id", authenticate, problemController.updateProblem);
problemRouter.delete("/:id", authenticate, problemController.deleteProblem);
problemRouter.post("/:id/submit", authenticate, solutionController.checkSolution);
problemRouter.post("/run", authenticate, solutionController.testRunCode);
problemRouter.get("/:id/solution", authenticate, solutionController.getSolution);

module.exports = problemRouter;
