const { Router } = require("express");
const fileController = require("../controllers/file.controller.js");
const fileRoutes = Router();

fileRoutes.post("/upload", fileController.upload);
fileRoutes.get("/upload", fileController.getFiles);
fileRoutes.delete("/upload/:id", fileController.deleteFile);
fileRoutes.delete("/upload/all", fileController.deleteAllFiles);

module.exports = fileRoutes;