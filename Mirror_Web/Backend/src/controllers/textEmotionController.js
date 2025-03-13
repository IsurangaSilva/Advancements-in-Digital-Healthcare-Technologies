const mongoose = require("mongoose");
const Text_Emotion_Prediction = require("../models/text_emotion.model"); 

// Get All Text Emotions
const getAllTextEmotions = async (req, res) => {
    try {
        const emotions = await Text_Emotion_Prediction.find();
        res.json({ success: true, emotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};


const getEmotionsByTimestampFilter = async (req, res) => {
    try {
        const { filter } = req.query; // filter can be "15min", "1hour", "day", "week", or "month"
        const now = new Date();
        let startTime;

        switch (filter) {
            case "15min":
                startTime = new Date(now.getTime() - 15 * 60 * 1000); // Last 15 minutes
                break;
            case "1hour":
                startTime = new Date(now.getTime() - 60 * 60 * 1000); // Last 1 hour
                break;
            case "day":
                startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
                break;
            case "week":
                startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
                break;
            case "month":
                startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
                break;
            default:
                return res.status(400).json({ msg: "Invalid filter provided", success: false });
        }

        // const emotions = await Text_Emotion_Prediction.find({
        //     timestamp: { $gte: startTime.toISOString(), $lte: now.toISOString() }
        // }).sort({ timestamp: 1 });       
        const startTimeNew = "2025-03-09 00:00:00";
        const endTime = "2025-03-09 23:59:59";
        
        const filteredEmotions = await Text_Emotion_Prediction.find({
            timestamp: { $gte: startTimeNew, $lte: endTime } // Compare as strings
        }).sort({ timestamp: 1 });
        
        console.log("Filtered Emotions:", filteredEmotions);


        // console.log("Fetched Emotions:", emotions);

        // const emotionData = emotions.map(emotion => ({
        //     timestamp: emotion.timestamp,
        //     transcription: emotion.transcription,
        //     // Extract only the prediction part before the parentheses
        //     prediction: emotion?.prediction ? emotion.prediction.split(' ')[0] : "N/A",  
        //     polarity: emotion?.polarity ?? "N/A",      // Polarity seems to be 0 in your case
        // })).filter(Boolean);
        const emotionData = emotions.map(emotion => {
            console.log("Timestamp:", emotion.timestamp, "Type:", typeof emotion.timestamp); // Log value and type
            return {
                timestamp: emotion.timestamp,
                transcription: emotion.transcription,
                prediction: emotion?.prediction ? emotion.prediction.split(' ')[0] : "N/A",
                polarity: emotion?.polarity ?? "N/A",
            };
        }).filter(Boolean);
        
        console.log("Final Emotion Data:", emotionData);       
        
        res.json({ success: true, emotionData });        
        
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

module.exports = {
    getAllTextEmotions,
    getEmotionsByTimestampFilter
};