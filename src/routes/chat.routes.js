const { Router } = require("express");
const chatController = require("../controllers/chat.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const { requireRole } = require("../middlewares/role.middleware.js");
const chatRouter = Router();

chatRouter.get("/all", authenticate, requireRole(["admin", "student", "teacher"]), chatController.getAllTeachersStudentsAdmins);
chatRouter.get("/search/:username", authenticate, requireRole(["admin", "student", "teacher"]), chatController.searchTeachersStudentsAdminsByUserName);
chatRouter.post("/create", authenticate, requireRole(["admin", "student", "teacher"]), chatController.createChat);
chatRouter.get("/:userId", authenticate, requireRole(["admin", "student", "teacher"]), chatController.getChats);

module.exports = chatRouter;
