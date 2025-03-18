const mongoose = require("mongoose");
const connection = mongoose.connection.useDb("emotionDB");

const textAggregation60Schema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    timestamp: {
      type: String,
      required: true,
    },
    session_aggregate: {
      anger: { type: Number, required: true },
      fear: { type: Number, required: true },
      joy: { type: Number, required: true },
      neutral: { type: Number, required: true },
      sadness: { type: Number, required: true },
      surprise: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const Text_Emotion_60Aggregate = connection.model(
  "text-emotion-60minaggregate",textAggregation60Schema
);

module.exports = Text_Emotion_60Aggregate;
