const express = require("express");
const router = express.Router();
const { getAllFEREmotions, getAllFER60Emotions } = require("../controllers/ferEmotionController");

//Get All FER Emotions of an User
router.get("/feremotions", getAllFEREmotions);

//Get All FER 60 Emotions of an User
router.get("/fer60emotions", getAllFER60Emotions);

module.exports = router;