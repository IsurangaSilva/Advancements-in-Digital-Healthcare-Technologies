const express = require("express");
const router = express.Router();
const { getAllTextEmotions,getEmotionsByTimestampFilter } = require("../controllers/contact.controller");

//Get All Text Emotions An User
router.post("/readContact", getAllTextEmotions);


module.exports = router;