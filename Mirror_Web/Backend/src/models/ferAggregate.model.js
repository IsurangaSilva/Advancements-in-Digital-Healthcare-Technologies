const mongoose = require("mongoose");
const connection = mongoose.connection.useDb("emotionDB");

const ferAggregationSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    timestamp: {
      type: String,
      required: true,
    },
    aggregated_emotions: {
      Anger: { type: Number, required: true },
      Fear: { type: Number, required: true },
      Happy: { type: Number, required: true },
      Neutral: { type: Number, required: true },
      Sad: { type: Number, required: true },
      Surprise: { type: Number, required: true },
    },
    db_status: {
      type: Boolean,
      default: true
    },
    session_used: {
      type: Boolean,
      default: false
    },
    session_used_hour: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const FER_Emotion_Aggregate = connection.model(
  "fer-aggregates", ferAggregationSchema
);

module.exports = FER_Emotion_Aggregate;
