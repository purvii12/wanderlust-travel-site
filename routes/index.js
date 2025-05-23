const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Hi, I am root"));

module.exports = router;
