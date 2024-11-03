const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
require("./src/backup.js");
require("./src/connection.js");
const routes = require("./src/routes/router.js");
const ejsRoutes = require("./frontend/routes/ejsRoutes.js");

const API_PORT = 5000;
const EJS_PORT = 5002;

const apiApp = express();
apiApp.use(express.json());
apiApp.use(cors());
apiApp.use("/api", routes);
apiApp.get("/", (req, res) => {
  return res.json({ message: "API server is running!" });
});

function startServerOnPort(app, port) {
  const listen = app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
  );
  listen.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log(`Port ${port} is busy. Trying a different port...`);
      startServerOnPort(app, port + 1);
    } else {
      console.error(`Server error: ${error.message}`);
    }
  });
}

startServerOnPort(apiApp, API_PORT);

const ejsApp = express();
ejsApp.set("view engine", "ejs");
ejsApp.set("views", "./frontend/template");
ejsApp.use("/", ejsRoutes);

startServerOnPort(ejsApp, EJS_PORT);
module.exports = { apiApp, ejsApp };
