const mongoose = require("mongoose");
const connection = mongoose.connection.useDb("emotionDB");

const ferAggregationSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    timestamp: {
      type: String,
      required: true,
    },
    session_aggregate: {
      Anger: { type: Number, required: true },
      Fear: { type: Number, required: true },
      Happy: { type: Number, required: true },
      Neutral: { type: Number, required: true },
      Sad: { type: Number, required: true },
      Surprise: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const FER_Emotion_Aggregate = connection.model(
  "fer-session-aggregates",ferAggregationSchema
);

module.exports = FER_Emotion_Aggregate;
