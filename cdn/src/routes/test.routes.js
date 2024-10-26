const { Router } = require("express");
const testController = require("../controllers/test.controller.js");
const testRoutes = Router();

testRoutes.post("/upload", testController.upload);
testRoutes.get("/upload", testController.getTest);

module.exports = testRoutes;