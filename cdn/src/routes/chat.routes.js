const { Router } = require("express");
const chatController = require("../controllers/chat.controller.js");
const chatRoutes = Router();

chatRoutes.post("/upload", chatController.upload);
chatRoutes.get("/upload", chatController.getChats);

module.exports = chatRoutes;