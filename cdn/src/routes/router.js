const { Router } = require("express");
const fileRoutes = require("./file.routes.js");
const testRoutes = require("./test.routes.js");
const router = Router();

router.use("/files", fileRoutes);
router.use("/tests", testRoutes);
module.exports = router;