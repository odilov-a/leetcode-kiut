const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
require("./src/backup.js");
require("./src/connection.js");
const routes = require("./src/routes/router.js");
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", routes);
app.get("/", (req, res) => {
  return res.json({ message: "Server is running!" });
});

function startServerOnPort(port) {
  const listen = app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
  );
  listen.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log(`Port ${port} is busy. Trying a different port...`);
      startServerOnPort(port + 1);
    } else {
      console.error(`Server error: ${error.message}`);
    }
  });
}
startServerOnPort(PORT);

module.exports = app;
