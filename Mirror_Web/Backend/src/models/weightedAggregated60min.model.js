const mongoose = require("mongoose");
const connection = mongoose.connection.useDb("emotionDB");

const weightedAggregated60minEmotionchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    },   
    weightedAverages: {
      joy: { type: Number, required: true },
      sadness: { type: Number, required: true },
      anger: { type: Number, required: true },
      fear: { type: Number, required: true },
      surprise: { type: Number, required: true },
      neutral: { type: Number, required: true }
    },     
  },
  { timestamps: true }
);

const WeightedAggregated60minEmotion = connection.model(
  "weighted-aggreagated-emotion-60min",
  weightedAggregated60minEmotionchema
);

module.exports = WeightedAggregated60minEmotion;