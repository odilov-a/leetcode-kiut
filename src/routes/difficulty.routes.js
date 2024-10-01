const { Router } = require("express");
const difficultyController = require("../controllers/difficulty.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const difficultyRouter = Router();

difficultyRouter.get("/", difficultyController.getAllDifficulties);
difficultyRouter.get("/:id", difficultyController.getDifficultyById);
difficultyRouter.post("/", authenticate, difficultyController.createDifficulty);
difficultyRouter.put("/:id", authenticate, difficultyController.updateDifficulty);
difficultyRouter.delete("/:id", authenticate, difficultyController.deleteDifficulty);

module.exports = difficultyRouter;
