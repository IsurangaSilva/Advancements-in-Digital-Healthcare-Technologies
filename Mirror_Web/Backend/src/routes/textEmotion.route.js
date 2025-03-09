const express = require("express");
const router = express.Router();
const { getAllTextEmotions,getEmotionsByTimestampFilter } = require("../controllers/textEmotionController");

//Get All Text Emotions An User
router.get("/textemotions", getAllTextEmotions);
router.get("/textemotions-time", getEmotionsByTimestampFilter);

module.exports = router;