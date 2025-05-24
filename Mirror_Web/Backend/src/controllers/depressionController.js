const axios = require('axios');

// List of the emotions you want to average across
const EMOTIONS_LIST = ['Anger', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];

function mapDepressionRating(averageScore) {
  const scaledScore = averageScore * 100; // convert 0–1 to 0–100

  if (scaledScore <= 40) {
    return 'Normal / No Symptoms';
  } else if (scaledScore <= 50) {
    return 'Mild Depression';
  } else if (scaledScore <= 70) {
    return 'Moderate Depression';
  } else {
    return 'Severe Depression';
  }
}

// Controller function to calculate depression predictions.
exports.getDepressionPrediction = async (req, res) => {
  try {
    // Fetch data concurrently from the three endpoints.
    const [ferResponse, audioResponse, textResponse] = await Promise.all([
      axios.get('http://localhost:4000/api/fer/fer60emotions'),
      axios.get('http://localhost:4000/api/audio/audio60emotions'),
      axios.get('http://localhost:4000/api/text/textemotionshourly')
    ]);

    // Extract the FER and Audio arrays directly.
    const ferEmotions = ferResponse.data?.emotions;
    const audioEmotions = audioResponse.data?.emotions;

    // Convert the Text data to match the same structure: each item is a "day."
    let textEmotions;
    if (textResponse.data?.emotions) {
      // If the text endpoint already returns an "emotions" array:
      textEmotions = textResponse.data.emotions;
    } else if (textResponse.data?.emotionshourly) {
      // Map each hourly item directly into a single "day"-like object
      textEmotions = textResponse.data.emotionshourly.map((item) => ({
        session_aggregate: {
          // We assume "sadness" in text is analogous to "Sad" in FER/Audio
          Sad: item.session_aggregate.sadness,
          Anger: item.session_aggregate.anger,
          Fear: item.session_aggregate.fear,
          Happy: item.session_aggregate.joy,
          Neutral: item.session_aggregate.neutral,
          Surprise: item.session_aggregate.surprise
        },
        _id: item._id,
        timestamp: item.timestamp,
        db_status: false
      }));
    } else {
      return res.status(500).json({
        error: 'Text response does not have the expected data.'
      });
    }

    // Ensure each data source is an array and has at least 7 items
    if (!Array.isArray(ferEmotions) || ferEmotions.length < 7 ||
        !Array.isArray(audioEmotions) || audioEmotions.length < 7 ||
        !Array.isArray(textEmotions) || textEmotions.length < 7) {
      return res.status(400).json({
        error: 'Not enough data. At least 7 items (days) of data required.'
      });
    }

    // Get the last 7 items from each array
    const ferLast7 = ferEmotions.slice(-7);
    const audioLast7 = audioEmotions.slice(-7);
    const textLast7 = textEmotions.slice(-7);

    // We'll accumulate sums of weighted averages for each emotion
    const sumEmotions = {
      Anger: 0,
      Fear: 0,
      Happy: 0,
      Neutral: 0,
      Sad: 0,
      Surprise: 0
    };

    // We'll also track daily depression scores (from Sad), to get the final average
    const dailySadScores = [];

    for (let i = 0; i < 7; i++) {
      // Weighted "Sad" for daily depression
      const ferSad = ferLast7[i].session_aggregate.Sad || 0;
      const audioSad = audioLast7[i].session_aggregate.Sad || 0;
      const textSad = textLast7[i].session_aggregate.Sad || 0;
      const dailySad = ferSad * 0.4 + audioSad * 0.3 + textSad * 0.3;
      dailySadScores.push(dailySad);

      // Weighted average for all emotions
      EMOTIONS_LIST.forEach((emotion) => {
        const ferVal = ferLast7[i].session_aggregate[emotion] || 0;
        const audioVal = audioLast7[i].session_aggregate[emotion] || 0;
        const textVal = textLast7[i].session_aggregate[emotion] || 0;
        const weightedVal = ferVal * 0.4 + audioVal * 0.3 + textVal * 0.3;
        sumEmotions[emotion] += weightedVal;
      });
    }

    // Final average depression score (0–1)
    const averageDepressionScore =
      dailySadScores.reduce((acc, val) => acc + val, 0) / 7;

    // Convert average score to rating
    const rating = mapDepressionRating(averageDepressionScore);

    // Compute average of each emotion (over 7 items)
    for (let emotion of EMOTIONS_LIST) {
      sumEmotions[emotion] = sumEmotions[emotion] / 7;
    }

    // Return final JSON
    return res.status(200).json({
      averageDepressionScore,
      rating,
      averageEmotions: sumEmotions
    });
  } catch (error) {
    console.error('Error calculating depression predictions:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};
