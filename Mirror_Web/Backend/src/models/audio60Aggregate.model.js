const mongoose = require("mongoose");
const connection = mongoose.connection.useDb("emotionDB");

const audioAggregation60Schema = new mongoose.Schema(
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

const AUDIO_Emotion_60Aggregate = connection.model(
  "audio-60-aggregates",audioAggregation60Schema
);

module.exports = AUDIO_Emotion_60Aggregate;
