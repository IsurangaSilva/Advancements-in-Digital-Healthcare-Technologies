// // const mongoose = require("mongoose");
// // const Text_Emotion_Prediction = require("../models/text_emotion.model"); 
// // const Text_Emotion_Aggregate = require("../models/textAggregate.model"); 
// // const Text_Emotion_60Aggregate = require("../models/text60Aggregate.model");

// // const getTextAggregateEmotions5minaverage = async (req, res) => {
// //     try {
// //         const result = await Text_Emotion_Aggregate.aggregate([
// //             {
// //                 $match: {
// //                     session_aggregate: { $exists: true, $ne: null }
// //                 }
// //             },
// //             {
// //                 $group: {
// //                     _id: null,
// //                     count: { $sum: 1 },
// //                     joy: { $avg: "$session_aggregate.joy" },
// //                     sadness: { $avg: "$session_aggregate.sadness" },
// //                     anger: { $avg: "$session_aggregate.anger" },
// //                     fear: { $avg: "$session_aggregate.fear" },
// //                     surprise: { $avg: "$session_aggregate.surprise" },
// //                     neutral: { $avg: "$session_aggregate.neutral" }
// //                 }
// //             },
// //             {
// //                 $project: {
// //                     _id: 0,
// //                     count: 1,
// //                     joy: { $round: ["$joy", 4] },
// //                     sadness: { $round: ["$sadness", 4] },
// //                     anger: { $round: ["$anger", 4] },
// //                     fear: { $round: ["$fear", 4] },
// //                     surprise: { $round: ["$surprise", 4] },
// //                     neutral: { $round: ["$neutral", 4] }
// //                 }
// //             }
// //         ]);

// //         const averages = result[0] || {
// //             count: 0,
// //             joy: 0,
// //             sadness: 0,
// //             anger: 0,
// //             fear: 0,
// //             surprise: 0,
// //             neutral: 0
// //         };

// //         res.json({ success: true, averages });
// //     } catch (error) {
// //         console.error("Aggregation error:", error);
// //         res.status(500).json({ msg: "Internal Server Error", success: false });
// //     }
// // };



// // module.exports = {
// //     getTextAggregateEmotions5minaverage
// // };

// const Text_Emotion_Aggregate = require("../models/textAggregate.model");
// const Voice_Emotion_Aggregate = require("../models/voiceAggregate.model");
// const Face_Emotion_Aggregate = require("../models/ferAggregate.model");

// const getAverageEmotions = async (Model) => {
//     const result = await Model.aggregate([
//         {
//             $match: {
//                 session_aggregate: { $exists: true, $ne: null }
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 count: { $sum: 1 },
//                 joy: { $avg: "$session_aggregate.joy" },
//                 sadness: { $avg: "$session_aggregate.sadness" },
//                 anger: { $avg: "$session_aggregate.anger" },
//                 fear: { $avg: "$session_aggregate.fear" },
//                 surprise: { $avg: "$session_aggregate.surprise" },
//                 neutral: { $avg: "$session_aggregate.neutral" }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 count: 1,
//                 joy: { $round: ["$joy", 4] },
//                 sadness: { $round: ["$sadness", 4] },
//                 anger: { $round: ["$anger", 4] },
//                 fear: { $round: ["$fear", 4] },
//                 surprise: { $round: ["$surprise", 4] },
//                 neutral: { $round: ["$neutral", 4] }
//             }
//         }
//     ]);

//     return result[0] || {
//         count: 0,
//         joy: 0,
//         sadness: 0,
//         anger: 0,
//         fear: 0,
//         surprise: 0,
//         neutral: 0
//     };
// };

// const getAllAggregateEmotions5minaverage = async (req, res) => {
//     try {
//         const [textAvg, voiceAvg, faceAvg] = await Promise.all([
//             getAverageEmotions(Text_Emotion_Aggregate),
//             getAverageEmotions(Voice_Emotion_Aggregate),
//             getAverageEmotions(Face_Emotion_Aggregate)
//         ]);

//         res.json({
//             success: true,
//             text: textAvg,
//             voice: voiceAvg,
//             face: faceAvg
//         });
//     } catch (error) {
//         console.error("Aggregation error:", error);
//         res.status(500).json({ msg: "Internal Server Error", success: false });
//     }
// };

// module.exports = {
//     getAllAggregateEmotions5minaverage
// };


const Text_Emotion_Aggregate = require("../models/textAggregate.model");
const Voice_Emotion_Aggregate = require("../models/voiceAggregate.model");
const FER_Emotion_Aggregate = require("../models/ferAggregate.model");
const Text60_Emotion_Aggregate = require("../models/text60Aggregate.model");
const Voice60_Emotion_Aggregate = require("../models/voice60Aggregate.model");
const FER60_Emotion_Aggregate = require("../models/fer60Aggregate.model");
const Weighted_5min_Emotion_Aggregate = require("../models/weightedAggregated5min.model");
const Weighted_60min_Emotion_Aggregate = require("../models/weightedAggregated60min.model");

const getAverageEmotions = async (Model, modelType) => {
    let aggregationPipeline = [];
    
    // Common match stage
    aggregationPipeline.push({
        $match: {
            session_aggregate: { $exists: true, $ne: null }
        }
    });

    // Model-specific group stage
    let groupStage = {
        _id: null,
        count: { $sum: 1 }
    };

    switch(modelType) {
        case 'text':
            groupStage.joy = { $avg: "$session_aggregate.joy" };
            groupStage.sadness = { $avg: "$session_aggregate.sadness" };
            groupStage.anger = { $avg: "$session_aggregate.anger" };
            groupStage.fear = { $avg: "$session_aggregate.fear" };
            groupStage.surprise = { $avg: "$session_aggregate.surprise" };
            groupStage.neutral = { $avg: "$session_aggregate.neutral" };
            break;
        case 'voice':
            groupStage.joy = { $avg: "$session_aggregate.happy" };
            groupStage.sadness = { $avg: "$session_aggregate.sad" };
            groupStage.anger = { $avg: "$session_aggregate.angry" };
            groupStage.fear = { $avg: "$session_aggregate.fear" };
            groupStage.surprise = { $avg: "$session_aggregate.surprise" };
            groupStage.neutral = { $avg: "$session_aggregate.neutral" };
            break;
        case 'face':
            groupStage.joy = { $avg: "$session_aggregate.Happy" };
            groupStage.sadness = { $avg: "$session_aggregate.Sad" };
            groupStage.anger = { $avg: "$session_aggregate.Anger" };
            groupStage.fear = { $avg: "$session_aggregate.Fear" };
            groupStage.surprise = { $avg: "$session_aggregate.Surprise" };
            groupStage.neutral = { $avg: "$session_aggregate.Neutral" };
            break;
    }

    aggregationPipeline.push({ $group: groupStage });

    // Common project stage
    aggregationPipeline.push({
        $project: {
            _id: 0,
            count: 1,
            joy: { $round: ["$joy", 4] },
            sadness: { $round: ["$sadness", 4] },
            anger: { $round: ["$anger", 4] },
            fear: { $round: ["$fear", 4] },
            surprise: { $round: ["$surprise", 4] },
            neutral: { $round: ["$neutral", 4] }
        }
    });

    const result = await Model.aggregate(aggregationPipeline);

    return result[0] || {
        count: 0,
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        surprise: 0,
        neutral: 0
    };
};

const getAllAggregateEmotions5minaverage = async (req, res) => {
    try {
        const [textAvg, voiceAvg, faceAvg] = await Promise.all([
            getAverageEmotions(Text_Emotion_Aggregate, 'text'),
            getAverageEmotions(Voice_Emotion_Aggregate, 'voice'),
            getAverageEmotions(FER_Emotion_Aggregate, 'face')
        ]);

        res.json({
            success: true,
            text: textAvg,
            voice: voiceAvg,
            face: faceAvg
        });
    } catch (error) {
        console.error("Aggregation error:", error);
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

const getAllAggregateEmotions60minaverage = async (req, res) => {
    try {
        const [textAvg, voiceAvg, faceAvg] = await Promise.all([
            getAverageEmotions(Text60_Emotion_Aggregate, 'text'),
            getAverageEmotions(Voice60_Emotion_Aggregate, 'voice'),
            getAverageEmotions(FER60_Emotion_Aggregate, 'face')
        ]);

        res.json({
            success: true,
            text: textAvg,
            voice: voiceAvg,
            face: faceAvg
        });
    } catch (error) {
        console.error("Aggregation error:", error);
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};



// Weights configuration
const WEIGHTS = {
    text: 0.40,
    face: 0.35,
    voice: 0.25
};

const getLastRecord = async (Model, modelType) => {
    try {
        // Get the most recent record by sorting in descending order of _id and limiting to 1
        const record = await Model.findOne().sort({ _id: -1 }).lean();
        
        if (!record || !record.session_aggregate) {
            return {
                joy: 0,
                sadness: 0,
                anger: 0,
                fear: 0,
                surprise: 0,
                neutral: 0
            };
        }

        // Map the record's fields to our standard emotion names
        switch(modelType) {
            case 'text':
                return {
                    joy: record.session_aggregate.joy || 0,
                    sadness: record.session_aggregate.sadness || 0,
                    anger: record.session_aggregate.anger || 0,
                    fear: record.session_aggregate.fear || 0,
                    surprise: record.session_aggregate.surprise || 0,
                    neutral: record.session_aggregate.neutral || 0
                };
            case 'voice':
                return {
                    joy: record.session_aggregate.happy || 0,
                    sadness: record.session_aggregate.sad || 0,
                    anger: record.session_aggregate.angry || 0,
                    fear: record.session_aggregate.fear || 0,
                    surprise: record.session_aggregate.surprise || 0,
                    neutral: record.session_aggregate.neutral || 0
                };
            case 'face':
                return {
                    joy: record.session_aggregate.Happy || 0,
                    sadness: record.session_aggregate.Sad || 0,
                    anger: record.session_aggregate.Anger || 0,
                    fear: record.session_aggregate.Fear || 0,
                    surprise: record.session_aggregate.Surprise || 0,
                    neutral: record.session_aggregate.Neutral || 0
                };
            default:
                return {
                    joy: 0,
                    sadness: 0,
                    anger: 0,
                    fear: 0,
                    surprise: 0,
                    neutral: 0
                };
        }
    } catch (error) {
        console.error(`Error getting last ${modelType} record:`, error);
        return {
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            surprise: 0,
            neutral: 0
        };
    }
};

const calculateDominantEmotion = (weightedAverages) => {
    // Remove neutral from consideration for dominant emotion
    const { neutral, ...emotions } = weightedAverages;
    
    // Find the emotion with the highest score
    let dominantEmotion = '';
    let maxScore = -1;
    
    for (const [emotion, score] of Object.entries(emotions)) {
        if (score > maxScore) {
            maxScore = score;
            dominantEmotion = emotion;
        }
    }
    
    return {
        emotion: dominantEmotion,
        score: maxScore,
        confidence: weightedAverages.neutral < 0.5 ? 'high' : 'medium' // Confidence based on neutral score
    };
};

const getAllAggregateEmotions5minweightedaverage = async (req, res) => {
    try {
        // Get the last record from each model
        const [textData, faceData, voiceData] = await Promise.all([
            getLastRecord(Text_Emotion_Aggregate, 'text'),
            getLastRecord(FER_Emotion_Aggregate, 'face'),
            getLastRecord(Voice_Emotion_Aggregate, 'voice')
        ]);

        // Calculate weighted averages
        const weightedAverages = {
            joy: Math.round((
                (textData.joy * WEIGHTS.text) +
                (faceData.joy * WEIGHTS.face) +
                (voiceData.joy * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            sadness: Math.round((
                (textData.sadness * WEIGHTS.text) +
                (faceData.sadness * WEIGHTS.face) +
                (voiceData.sadness * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            anger: Math.round((
                (textData.anger * WEIGHTS.text) +
                (faceData.anger * WEIGHTS.face) +
                (voiceData.anger * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            fear: Math.round((
                (textData.fear * WEIGHTS.text) +
                (faceData.fear * WEIGHTS.face) +
                (voiceData.fear * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            surprise: Math.round((
                (textData.surprise * WEIGHTS.text) +
                (faceData.surprise * WEIGHTS.face) +
                (voiceData.surprise * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            neutral: Math.round((
                (textData.neutral * WEIGHTS.text) +
                (faceData.neutral * WEIGHTS.face) +
                (voiceData.neutral * WEIGHTS.voice)
            ) * 10000) / 10000
        };

        // Determine the dominant emotion
        const dominantEmotion = calculateDominantEmotion(weightedAverages);

        const newRecord = new Weighted_5min_Emotion_Aggregate({ weightedAverages });
        await newRecord.save();


        res.json({
            success: true,
            // emotion: dominantEmotion.emotion,
            // score: dominantEmotion.score,
            confidence: dominantEmotion.confidence,
            weightedAverages: weightedAverages,
            weights: WEIGHTS
        });
    } catch (error) {
        console.error("Error in getAllAggregateEmotionsCombined:", error);
        res.status(500).json({ 
            success: false,
            msg: "Internal Server Error",
            emotion: "neutral",
            score: 0,
            confidence: "low"
        });
    }
};

const getAllAggregateEmotions60minweightedaverage = async (req, res) => {
    try {
        // Get the last record from each model
        const [textData, faceData, voiceData] = await Promise.all([
            getLastRecord(Text60_Emotion_Aggregate, 'text'),
            getLastRecord(FER60_Emotion_Aggregate, 'face'),
            getLastRecord(Voice60_Emotion_Aggregate, 'voice')
        ]);

        // Calculate weighted averages
        const weightedAverages = {
            joy: Math.round((
                (textData.joy * WEIGHTS.text) +
                (faceData.joy * WEIGHTS.face) +
                (voiceData.joy * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            sadness: Math.round((
                (textData.sadness * WEIGHTS.text) +
                (faceData.sadness * WEIGHTS.face) +
                (voiceData.sadness * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            anger: Math.round((
                (textData.anger * WEIGHTS.text) +
                (faceData.anger * WEIGHTS.face) +
                (voiceData.anger * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            fear: Math.round((
                (textData.fear * WEIGHTS.text) +
                (faceData.fear * WEIGHTS.face) +
                (voiceData.fear * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            surprise: Math.round((
                (textData.surprise * WEIGHTS.text) +
                (faceData.surprise * WEIGHTS.face) +
                (voiceData.surprise * WEIGHTS.voice)
            ) * 10000) / 10000,
            
            neutral: Math.round((
                (textData.neutral * WEIGHTS.text) +
                (faceData.neutral * WEIGHTS.face) +
                (voiceData.neutral * WEIGHTS.voice)
            ) * 10000) / 10000
        };

        // Determine the dominant emotion
        const dominantEmotion = calculateDominantEmotion(weightedAverages);

        const newRecord = new Weighted_60min_Emotion_Aggregate({ weightedAverages });
        await newRecord.save();        

        res.json({
            success: true,
            // emotion: dominantEmotion.emotion,
            // score: dominantEmotion.score,
            confidence: dominantEmotion.confidence,
            weightedAverages: weightedAverages,
            weights: WEIGHTS
        });
    } catch (error) {
        console.error("Error in getAllAggregateEmotionsCombined:", error);
        res.status(500).json({ 
            success: false,
            msg: "Internal Server Error",
            emotion: "neutral",
            score: 0,
            confidence: "low"
        });
    }
};

// Get All The Weighted aggregated Emotions
const getOne5minWeightedAggregatedEmotions = async (req, res) => {
    try {
        const weightedAverages = await Weighted_5min_Emotion_Aggregate.find();
        
        const formattedEmotions = weightedAverages.map(emotion => ({
            ...emotion._doc, 
            timestamp: new Date(emotion.timestamp).toISOString().replace("T", " ").split(".")[0] 
        }));

        res.json({ success: true, emotions: formattedEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

const getOne60minWeightedAggregatedEmotions = async (req, res) => {
    try {
        const weightedAverages = await Weighted_60min_Emotion_Aggregate.find();
        
        const formattedEmotions = weightedAverages.map(emotion => ({
            ...emotion._doc, 
            timestamp: new Date(emotion.timestamp).toISOString().replace("T", " ").split(".")[0] 
        }));

        res.json({ success: true, emotions: formattedEmotions });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};


const getHourlyDepression = async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const weightedAverages = await Weighted_60min_Emotion_Aggregate.find({
            timestamp: { $gte: twentyFourHoursAgo }
        }).lean();
        
        const recordCount = weightedAverages.length;
        
        // Calculate averages for each emotion
        const emotionSums = {
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            surprise: 0,
            neutral: 0
        };
        
        weightedAverages.forEach(emotion => {
            for (const key in emotion.weightedAverages) {
                emotionSums[key] += emotion.weightedAverages[key];
            }
        });
        
        const emotionAverages = {};
        for (const key in emotionSums) {
            emotionAverages[key] = recordCount > 0 ? emotionSums[key] / recordCount : 0;
        }

        res.json({ 
            success: true,
            recordCount,
            emotionAverages
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

const getWeeklyDepression = async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 7* 24 * 60 * 60 * 1000);
        
        const weightedAverages = await Weighted_60min_Emotion_Aggregate.find({
            timestamp: { $gte: twentyFourHoursAgo }
        }).lean();
        
        const recordCount = weightedAverages.length;
        
        // Calculate averages for each emotion
        const emotionSums = {
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            surprise: 0,
            neutral: 0
        };
        
        weightedAverages.forEach(emotion => {
            for (const key in emotion.weightedAverages) {
                emotionSums[key] += emotion.weightedAverages[key];
            }
        });
        
        const emotionAverages = {};
        for (const key in emotionSums) {
            emotionAverages[key] = recordCount > 0 ? emotionSums[key] / recordCount : 0;
        }

        res.json({ 
            success: true,
            recordCount,
            emotionAverages
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};


module.exports = {
    getAllAggregateEmotions5minaverage,
    getAllAggregateEmotions60minaverage,
    getAllAggregateEmotions5minweightedaverage,
    getAllAggregateEmotions60minweightedaverage,
    getOne5minWeightedAggregatedEmotions,
    getOne60minWeightedAggregatedEmotions,
    getHourlyDepression,
    getWeeklyDepression
};