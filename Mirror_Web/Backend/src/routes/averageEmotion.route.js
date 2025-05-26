const express = require("express");
const router = express.Router();

const {
    getAllAggregateEmotions5minaverage,
    getAllAggregateEmotions60minaverage,
    getAllAggregateEmotions5minweightedaverage,
    getAllAggregateEmotions60minweightedaverage,
    getOne5minWeightedAggregatedEmotions,
    getOne60minWeightedAggregatedEmotions,
    getHourlyDepression
} = require("../controllers/combinedEmotionController");

// average Time Frames
router.get("/5min-average", getAllAggregateEmotions5minaverage);
router.get("/60min-average", getAllAggregateEmotions60minaverage);
router.get("/5min-weighted-average", getAllAggregateEmotions5minweightedaverage);
router.get("/60min-weighted-average", getAllAggregateEmotions60minweightedaverage);
router.get("/combined-5min-weighted-average", getOne5minWeightedAggregatedEmotions);
router.get("/combined-60min-weighted-average", getOne60minWeightedAggregatedEmotions);
router.get("/hourlydepression", getHourlyDepression);

module.exports = router;