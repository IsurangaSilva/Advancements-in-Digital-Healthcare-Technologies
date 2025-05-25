const mongoose = require("mongoose");
const Voice_Emotion_Prediction = require("../models/voice_emotion.model"); 
const Voice_Emotion_Aggregate = require("../models/voiceAggregate.model"); 
const Voice_Emotion_60Aggregate = require("../models/voice60Aggregate.model");

// Get All Text Emotions
const getAllVoiceEmotions = async (req, res) => {
    try {
        const emotions = await Voice_Emotion_Prediction.find();
        
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
const getAllVoiceEmotionsPrecentages = async (req, res) => {
    try {
        const emotions = await Voice_Emotion_Prediction.find();
        
        if (emotions.length === 0) {
            return res.json({ success: true, percentages: {} });
        }

        // Count occurrences of each prediction
        const emotionCounts = {
            angry: 0,
            fear: 0,
            happy: 0,
            neutral: 0,
            sad: 0,
            surprise: 0
        };

        emotions.forEach(({ predicted_emotion }) => {
            if (emotionCounts.hasOwnProperty(predicted_emotion)) {
                emotionCounts[predicted_emotion]++;
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

        const latestEmotion = await Voice_Emotion_Prediction.findOne().sort({ timestamp: -1 });

        if (!latestEmotion || !latestEmotion.emotion_scores) {
            return res.json({ success: true, message: "No data available", percentages: {} });
        }

        // Convert emotion scores to percentages
        const emotionLastPercentages = Object.fromEntries(
            Object.entries(latestEmotion.emotion_scores).map(([emotion, score]) => [
                emotion, (score * 100).toFixed(2) // Convert to percentage with 2 decimal places
            ])
        );


        res.json({ success: true, percentages: emotionPercentages, counts: emotionCounts ,emotionLastPercentages:emotionLastPercentages});
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};


// Get Text Aggregation Emotions
const getVoiceAggregateEmotions = async (req, res) => {
    try {

         const emotions = await Voice_Emotion_Aggregate.find();
        
        const formattedEmotions = emotions.map(emotion => {
            const date = new Date(emotion.timestamp);
            const formattedTimestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

            return {
                ...emotion._doc,
                timestamp: formattedTimestamp
            };
        });

        // res.json({ success: true, emotions: formattedEmotions });

        const emotionshouraggregate = await Voice_Emotion_60Aggregate.find();
        console.log("emotionshouraggregate",emotionshouraggregate)
        
        const formattedhourEmotions = emotionshouraggregate.map(emotion => {
            const date = new Date(emotion.timestamp);
            const formattedTimestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

            return {
                ...emotion._doc,
                timestamp: formattedTimestamp
            };
        });

        

        res.json({ success: true, emotions: formattedEmotions ,emotionshourly: formattedhourEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

//5min Aggregation
const getVoiceAggregateEmotions5min = async (req, res) => {
    try {
        const emotions = await Voice_Emotion_Aggregate.find();
        
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

//1hour Aggregation
const getVoiceAggregateEmotionshourly = async (req, res) => {
    try {
        const emotionshouraggregate = await Voice_Emotion_60Aggregate.find();
        
        const formattedhourEmotions = emotionshouraggregate.map(emotion => {
            const date = new Date(emotion.timestamp);
            const formattedTimestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

            return {
                ...emotion._doc,
                timestamp: formattedTimestamp
            };
        });

        

        res.json({ success: true, emotionshourly: formattedhourEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};


// Get Text Aggregation Emotions
const getVoiceAggregateEmotions60min = async (req, res) => {
    try {
        const emotions = await Voice_Emotion_Aggregate.find();
        
        const formattedEmotions = emotions.map(emotion => {
            const date = new Date(emotion.timestamp);
            const formattedTimestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

            return {
                ...emotion._doc,
                timestamp: formattedTimestamp
            };
        });

        const emotionshouraggregate = await Voice_Emotion_Aggregate.find();
        console.log("emotionshouraggregate",emotionshouraggregate)
        
        const formattedhourEmotions = emotionshouraggregate.map(emotion => {
            const date = new Date(emotion.timestamp);
            const formattedTimestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

            return {
                ...emotionshouraggregate._doc,
                timestamp: formattedTimestamp
            };
        });

        

        res.json({ success: true, emotions: formattedEmotions, emotionshourly: formattedhourEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

module.exports = {
    getAllVoiceEmotions,    
    getAllVoiceEmotionsPrecentages,
    getVoiceAggregateEmotions,
    getVoiceAggregateEmotions60min,
    getVoiceAggregateEmotions5min,
    getVoiceAggregateEmotionshourly
};