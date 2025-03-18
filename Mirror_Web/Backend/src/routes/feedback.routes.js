const express = require("express");
const router = express.Router();
const {createFeedback} = require("../controllers/feedback.controller");

router.post("/createFeedback",createFeedback);

module.exports = router;
