const express = require("express");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
dotenv.config();
require("./src/backup.js");
require("./src/connection.js");
const routes = require("./src/routes/router.js");
const PORT = 5000;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after a minute",
});

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://leetcode-admin-kiut.vercel.app",
      "https://teacher-leetcode.vercel.app",
      "https://student-leetcode.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(helmet());
app.use("/api", limiter, routes);
app.get("/", (req, res) => {
  return res.json({ message: "Server is run!" });
});

function startServerOnPort(port) {
  const listen = app.listen(port, () =>
    console.log(`server is running ${port}`)
  );
  listen.on("error", () => {
    console.log(`Port ${port} is busy. Trying a different port...`);
    startServerOnPort(port + 1);
  });
}

startServerOnPort(PORT);
