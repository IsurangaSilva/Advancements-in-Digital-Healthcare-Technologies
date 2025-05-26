const express = require("express");
const router = express.Router();
const { getAllTextEmotions,getEmotionsByTimestampFilter,getTextAggregateEmotions,getAllTextEmotionsPrecentages,getTextAggregateEmotions5min,getTextAggregateEmotionshourly } = require("../controllers/textEmotionController");

//Get All Text Emotions An User
router.get("/textemotions", getAllTextEmotions);
router.get("/textaggregateemotions", getTextAggregateEmotions);
router.get("/textemotionsprecnetages", getAllTextEmotionsPrecentages);
router.get("/textemotions-time", getEmotionsByTimestampFilter);
router.get("/textemotions5min", getTextAggregateEmotions5min);
router.get("/textemotionshourly", getTextAggregateEmotionshourly);


module.exports = router;