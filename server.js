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

const apiServer = require("http").createServer(apiApp);

function startServerOnPort(server, appName, port) {
  const listen = server.listen(port, () => {
    console.log(`${appName} is running on port ${port}`);
  });
  listen.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log(
        `Port ${port} is busy. Trying a different port for ${appName}...`
      );
      startServerOnPort(server, appName, port + 1);
    } else {
      console.error(`${appName} error: ${error.message}`);
    }
  });
}

startServerOnPort(apiServer, "API Server", API_PORT);

const ejsApp = express();
ejsApp.set("view engine", "ejs");
ejsApp.set("views", "./frontend/template");
ejsApp.use("/", ejsRoutes);

const ejsServer = require("http").createServer(ejsApp);
startServerOnPort(ejsServer, "EJS Server", EJS_PORT);

module.exports = { apiApp, ejsApp };
