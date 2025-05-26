const AUDIO_Emotion_Prediction = require("../models/audioAggregate.model"); 
const AUDIO_Emotion_60Aggregate = require("../models/audio60Aggregate.model"); 

// Get All FER session Emotions
const getAllAudioEmotions = async (req, res) => {
    try {
        const emotions = await AUDIO_Emotion_Prediction.find();
        
        const formattedEmotions = emotions.map(emotion => ({
            ...emotion._doc, 
            timestamp: new Date(emotion.timestamp).toISOString().replace("T", " ").split(".")[0] 
        }));

        res.json({ success: true, emotions: formattedEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Get All FER 60 session Emotions
const getAllAudio60Emotions = async (req, res) => {
    try {
        const emotions = await AUDIO_Emotion_60Aggregate.find();
        
        const formattedEmotions = emotions.map(emotion => ({
            ...emotion._doc, 
            timestamp: new Date(emotion.timestamp).toISOString().replace("T", " ").split(".")[0] 
        }));

        res.json({ success: true, emotions: formattedEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

module.exports = {
    getAllAudioEmotions,
    getAllAudio60Emotions
};