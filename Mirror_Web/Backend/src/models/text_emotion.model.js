const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    transcription: {
        type: String,
        required: true
    },
    timestamp: {
        type: String, 
        required: true
    },
    prediction: {
        type: String,
        required: true
    },
    emotionScores: {
        anger: { type: Number, required: true },
        fear: { type: Number, required: true },
        joy: { type: Number, required: true },
        neutral: { type: Number, required: true },
        sadness: { type: Number, required: true },
        surprise: { type: Number, required: true }
    },
    vaderScore: {
        type: Number,
        required: true
    },
    polarity: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Prediction = mongoose.model('text-emotion-predictions', predictionSchema);

module.exports = Prediction;
