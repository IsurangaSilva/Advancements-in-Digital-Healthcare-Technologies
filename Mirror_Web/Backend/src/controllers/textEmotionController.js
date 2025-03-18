const mongoose = require("mongoose");
const Text_Emotion_Prediction = require("../models/text_emotion.model"); 
const Text_Emotion_Aggregate = require("../models/textAggregate.model"); 

// Get All Text Emotions
const getAllTextEmotions = async (req, res) => {
    try {
        const emotions = await Text_Emotion_Prediction.find();
        
        const formattedEmotions = emotions.map(emotion => ({
            ...emotion._doc, 
            timestamp: new Date(emotion.timestamp).toISOString().replace("T", " ").split(".")[0] 
        }));

        res.json({ success: true, emotions: formattedEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Get All Text Emotions Precentages
const getAllTextEmotionsPrecentages = async (req, res) => {
    try {
        const emotions = await Text_Emotion_Prediction.find();
        console.log("Emotions:",emotions)
        
        
        if (emotions.length === 0) {
            return res.json({ success: true, percentages: {} });
        }

        // Count occurrences of each prediction
        const emotionCounts = {
            anger: 0,
            fear: 0,
            joy: 0,
            neutral: 0,
            sadness: 0,
            surprise: 0
        };

        emotions.forEach(({ prediction }) => {
            if (emotionCounts.hasOwnProperty(prediction)) {
                emotionCounts[prediction]++;
            }
        });

        // Total predictions
        const total = emotions.length;

        // Calculate percentages
        const emotionPercentages = Object.fromEntries(
            Object.entries(emotionCounts).map(([emotion, count]) => [
                emotion,
                ((count / total) * 100).toFixed(2)
            ])
        );

        res.json({ success: true, percentages: emotionPercentages, counts: emotionCounts });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};


// Get Text Aggregation Emotions
const getTextAggregateEmotions = async (req, res) => {
    try {
        const emotions = await Text_Emotion_Aggregate.find();
        
        const formattedEmotions = emotions.map(emotion => {
            const date = new Date(emotion.timestamp);
            const formattedTimestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

            return {
                ...emotion._doc,
                timestamp: formattedTimestamp
            };
        });

        res.json({ success: true, emotions: formattedEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Get Text Aggregation Emotions
const getTextAggregateEmotions60min = async (req, res) => {
    try {
        const emotions = await Text_Emotion_Aggregate.find();
        
        const formattedEmotions = emotions.map(emotion => {
            const date = new Date(emotion.timestamp);
            const formattedTimestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

            return {
                ...emotion._doc,
                timestamp: formattedTimestamp
            };
        });

        res.json({ success: true, emotions: formattedEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};


const getEmotionsByTimestampFilter = async (req, res) => {
    try {
        const { filter } = req.query; 
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
    getEmotionsByTimestampFilter,
    getTextAggregateEmotions,
    getAllTextEmotionsPrecentages,
    getTextAggregateEmotions60min
};