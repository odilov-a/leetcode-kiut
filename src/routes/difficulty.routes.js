const { Router } = require("express");
const difficultyController = require("../controllers/difficulty.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const difficultyRouter = Router();

difficultyRouter.get("/", authenticate, requireRole(["teacher", "admin", "student"]), difficultyController.getAllDifficulties);
difficultyRouter.get("/:id", authenticate, requireRole(["teacher", "admin", "student"]), difficultyController.getDifficultyById);
difficultyRouter.post("/", authenticate, requireRole(["admin"]), difficultyController.createDifficulty);
difficultyRouter.put("/:id", authenticate, requireRole(["admin"]), difficultyController.updateDifficulty);
difficultyRouter.delete("/:id", authenticate, requireRole(["admin"]), difficultyController.deleteDifficulty);

module.exports = difficultyRouter;
