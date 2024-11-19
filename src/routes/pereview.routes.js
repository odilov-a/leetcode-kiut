const { Router } = require("express");
const pereviewController = require("../controllers/pereview.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const pereviewRouter = Router();

pereviewRouter.get("/marked", authenticate, requireRole(["teacher", "admin"]), pereviewController.getAllMarkedPereviews);
pereviewRouter.get("/random", authenticate, requireRole(["student"]), pereviewController.getRandomProjectForReview);
pereviewRouter.get("/status", authenticate, requireRole(["student"]), pereviewController.getPereviewsStutus);
pereviewRouter.post("/", authenticate, requireRole(["student"]), pereviewController.submitProjectToPereview);
pereviewRouter.get("/:id", authenticate, requireRole(["teacher", "admin", "student"]), pereviewController.getPereviewById);
pereviewRouter.put("/:id", authenticate, requireRole(["teacher", "admin", "student"]), pereviewController.updatePereview);
pereviewRouter.put("/teacher/:id", authenticate, requireRole(["teacher"]), pereviewController.updateIsTeacherMarked);

module.exports = pereviewRouter;
