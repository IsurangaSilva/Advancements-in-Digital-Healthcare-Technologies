// controllers/voiceEmotionController.js
const mongoose = require("mongoose");
const Voice_Emotion_Prediction = require("../models/VoiceEmotion");
const fs = require('fs').promises;
const path = require('path');

// Load static data
const loadData = async (filename) => {
    const filePath = path.join(__dirname, '../data', filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
};

// Get All Voice Emotions (individual predictions)
const getAllVoiceEmotions = async (req, res) => {
    try {
        const individualData = await loadData('individual_predictions.json');
        res.json({ success: true, emotions: individualData });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Get Voice Emotions by Time Filter (with aggregates)
const getVoiceEmotionsByTimeFilter = async (req, res) => {
    try {
        const { filter } = req.query;
        const now = new Date("2025-03-18T01:30:35.142335"); // Using latest timestamp as "now"
        let startTime;

        switch (filter) {
            case "15min":
                startTime = new Date(now.getTime() - 15 * 60 * 1000);
                break;
            case "1hour":
                startTime = new Date(now.getTime() - 60 * 60 * 1000);
                break;
            case "day":
                startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "week":
                startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                return res.status(400).json({ msg: "Invalid filter provided", success: false });
        }

        const individualData = await loadData('individual_predictions.json');
        const sessionData = await loadData('session_aggregates.json');
        const hourlyData = await loadData('hourly_aggregates.json');

        // Filter individual predictions
        const filteredEmotions = individualData.filter(emotion => {
            const timestamp = new Date(emotion.timestamp);
            return timestamp >= startTime && timestamp <= now;
        }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Filter session aggregates
        const filteredSessions = sessionData.filter(session => {
            const timestamp = new Date(session.timestamp);
            return timestamp >= startTime && timestamp <= now;
        }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Get relevant hourly aggregate (assuming only one for now)
        const aggregate = hourlyData.length > 0 ? hourlyData[0].hourly_aggregate : {};

        res.json({
            success: true,
            emotions: filteredEmotions,
            sessions: filteredSessions,
            aggregate: {
                timestamp: hourlyData[0]?.timestamp || now.toISOString(),
                daily_aggregate: aggregate
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Add New Voice Emotion (for future live data)
const addVoiceEmotion = async (req, res) => {
    try {
        const emotionData = {
            _id: new mongoose.Types.ObjectId(),
            timestamp: new Date().toISOString(),
            predicted_emotion: req.body.predicted_emotion || "unknown",
            emotion_scores: {
                anger: req.body.emotion_scores?.anger || 0,
                fear: req.body.emotion_scores?.fear || 0,
                happy: req.body.emotion_scores?.happy || 0,
                neutral: req.body.emotion_scores?.neutral || 0,
                sad: req.body.emotion_scores?.sad || 0,
                surprise: req.body.emotion_scores?.surprise || 0
            }
        };

        const newEmotion = new Voice_Emotion_Prediction(emotionData);
        await newEmotion.save();

        // Optionally append to JSON file (for demo purposes)
        const individualData = await loadData('individual_predictions.json');
        individualData.push(emotionData);
        await fs.writeFile(
            path.join(__dirname, '../data/individual_predictions.json'),
            JSON.stringify(individualData, null, 2)
        );

        res.status(201).json({ success: true, emotion: newEmotion });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

module.exports = {
    getAllVoiceEmotions,
    getVoiceEmotionsByTimeFilter,
    addVoiceEmotion
};