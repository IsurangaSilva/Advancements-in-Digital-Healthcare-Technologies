const mongoose = require("mongoose");
const connection = mongoose.connection.useDb("emotionDB");

const audioAggregationSchema = new mongoose.Schema(
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

const AUDIO_Emotion_Aggregate = connection.model(
  "audio-session-aggregates",audioAggregationSchema
);

module.exports = AUDIO_Emotion_Aggregate;
