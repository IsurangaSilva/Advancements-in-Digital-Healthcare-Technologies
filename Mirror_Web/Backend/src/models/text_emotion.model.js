const mongoose = require('mongoose');
const connection = mongoose.connection.useDb('emotionDB');

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
    prediction_score: {
        type: Number,
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
    },
    subjectivity: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Text_Emotion_Prediction = connection.model('text-emotion-predictions', predictionSchema);

module.exports = Text_Emotion_Prediction;
