const { Router } = require("express");
const statisticsController = require("../controllers/statistics.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const statisticsRouter = Router();

statisticsRouter.get("/languages", authenticate, requireRole(["admin"]), statisticsController.languageDistribution);
statisticsRouter.get("/accuracy", authenticate, requireRole(["admin"]), statisticsController.submissionAccuracyByLanguage);
statisticsRouter.get("/average-accuracy", authenticate, requireRole(["admin"]), statisticsController.averageAccuracyPerLanguage);

module.exports = statisticsRouter;
