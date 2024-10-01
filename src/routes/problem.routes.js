const { Router } = require("express");
const problemController = require("../controllers/problem.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const problemRouter = Router();

problemRouter.get("/", problemController.getAllProblems);
problemRouter.get("/:id", problemController.getProblemById);
problemRouter.get("/difficulty/:difficulty", problemController.getAllProblemsByDifficulty);
problemRouter.get("/subject/:subject", problemController.getAllProblemsBySubject);
problemRouter.get("/search", problemController.searchProblems);
problemRouter.get("/:subject/:difficulty", problemController.getProblemsBySubjectAndDifficulty);
problemRouter.post("/", authenticate, problemController.createProblem);
problemRouter.put("/:id", authenticate, problemController.updateProblem);
problemRouter.delete("/:id", authenticate, problemController.deleteProblem);
problemRouter.post("/:id/submit", authenticate, problemController.submitAnswer);

module.exports = problemRouter;
