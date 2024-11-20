const { Router } = require("express");
const fileRoutes = require("./file.routes.js");
const testRoutes = require("./test.routes.js");
const chatRoutes = require("./chat.routes.js");
const router = Router();

router.use("/files", fileRoutes);
router.use("/tests", testRoutes);
router.use("/chats", chatRoutes);
module.exports = router;