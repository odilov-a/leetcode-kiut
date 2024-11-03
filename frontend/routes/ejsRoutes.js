const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.render("index");
});

router.get("/about", (req, res) => {
  return res.render("about");
});

router.get("/contact", (req, res) => {
  return res.render("contact");
});

module.exports = router;
