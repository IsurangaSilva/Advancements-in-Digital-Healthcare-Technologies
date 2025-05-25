const express = require("express");
const router = express.Router();
const { getAllVoiceEmotions,getAllVoiceEmotionsPrecentages,getVoiceAggregateEmotions,getVoiceAggregateEmotionshourly } = require("../controllers/voiceEmotionController");

//Get All Text Emotions An User
router.get("/voiceemotions", getAllVoiceEmotions);
router.get("/voiceaggregateemotions", getVoiceAggregateEmotions);
router.get("/voiceemotionsprecentage", getAllVoiceEmotionsPrecentages);
// router.get("/textemotions-time", getEmotionsByTimestampFilter);
// router.get("/textemotions5min", getTextAggregateEmotions5min);
router.get("/voiceemotionshourly", getVoiceAggregateEmotionshourly);

module.exports = router;