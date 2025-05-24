const FER_Emotion_Prediction = require("../models/ferAggregate.model"); 
const FER_Emotion_60Aggregate = require("../models/fer60Aggregate.model"); 

// Get All FER session Emotions
const getAllFEREmotions = async (req, res) => {
    try {
        const emotions = await FER_Emotion_Prediction.find();
        
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
const getAllFER60Emotions = async (req, res) => {
    try {
        const emotions = await FER_Emotion_60Aggregate.find();
        
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
    getAllFEREmotions,
    getAllFER60Emotions
};