const { Router } = require("express");
const statisticsController = require("../controllers/statistics.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const statisticsRouter = Router();

statisticsRouter.get("/languages", authenticate, requireRole(["admin"]), statisticsController.languageDistribution);

module.exports = statisticsRouter;
