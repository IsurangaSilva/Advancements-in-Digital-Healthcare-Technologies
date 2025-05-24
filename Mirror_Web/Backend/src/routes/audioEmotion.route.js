const express = require("express");
const router = express.Router();
const { getAllAudioEmotions, getAllAudio60Emotions } = require("../controllers/audioEmotionController");

//Get All FER Emotions of an User
router.get("/audioemotions", getAllAudioEmotions);

//Get All FER 60 Emotions of an User
router.get("/audio60emotions", getAllAudio60Emotions);

module.exports = router;