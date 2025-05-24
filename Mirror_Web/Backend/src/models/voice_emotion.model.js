const mongoose = require('mongoose');
const connection = mongoose.connection.useDb('emotionDB');

const voicepredictionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    
    timestamp: {
        type: String, 
        required: true
    },
    predicted_emotion: {
        type: String,
        required: true
    },   
    emotion_scores: {
        angry: { type: Number, required: true },
        fear: { type: Number, required: true },
        happy: { type: Number, required: true },
        neutral: { type: Number, required: true },
        sad: { type: Number, required: true },
        surprise: { type: Number, required: true }
    },    
}, { timestamps: true });

const Voice_Emotion_Prediction = connection.model('voice-emotion-predictions', voicepredictionSchema);

module.exports = Voice_Emotion_Prediction;
