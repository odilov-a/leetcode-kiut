const { Router } = require("express");
const testController = require("../controllers/test.controller.js");
const testRoutes = Router();

testRoutes.post("/upload", testController.upload);

module.exports = testRoutes;