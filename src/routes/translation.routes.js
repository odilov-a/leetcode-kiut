const { Router } = require("express");
const translationController = require("../controllers/translation.controller.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const translationRouter = Router();

translationRouter.get("/", authenticate, requireRole(["admin"]), translationController.getAll);
translationRouter.get("/:lang", authenticate, requireRole(["admin"]), translationController.findByLang);
translationRouter.get("/search/:message", authenticate, requireRole(["admin"]), translationController.search);
translationRouter.post("/:lang", authenticate, requireRole(["admin"]), translationController.create);
translationRouter.put("/:id", authenticate, requireRole(["admin"]), translationController.update);

module.exports = translationRouter;
