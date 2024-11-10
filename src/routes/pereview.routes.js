const { Router } = require("express");
const pereviewController = require("../controllers/pereview.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const pereviewRouter = Router();

pereviewRouter.post("/", authenticate, requireRole(["student"]), pereviewController.submitProjectToPereview);

pereviewRouter.get("/project/:projectId", authenticate, pereviewController.getPereview);

pereviewRouter.get("/reviewer/:reviewerId", authenticate, requireRole(["teacher", "admin"]), pereviewController.getPereviewByReviewer);

pereviewRouter.get("/:id", authenticate, pereviewController.getPereviewById);

pereviewRouter.put("/:id", authenticate, requireRole(["teacher", "admin", "student"]), pereviewController.updatePereview);

pereviewRouter.get("/random", authenticate, requireRole(["student"]), pereviewController.getRandomProjectForReview);

module.exports = pereviewRouter;
