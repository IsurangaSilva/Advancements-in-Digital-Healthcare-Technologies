const express = require("express");
const router = express.Router();
const { getDepressionPrediction} = require("../controllers/depressionController");

// Route to calculate depression predictions.
router.get("/depressionprediction", getDepressionPrediction);

module.exports = router;