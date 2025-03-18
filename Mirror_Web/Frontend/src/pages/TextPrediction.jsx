import React, { useEffect, useState } from "react";
import axios from "axios";
import EmotionChart from "./TextEmotionChart";
import EmotionAggregationChart from "./TextAggregationChart";
import EmotionPercentageChart from "./TextEmotionPercenatge";

const TextPrediction = () => {
  const [emotions, setEmotions] = useState([]);
  const [aggreagationsHourly, setAggreagationsHourly] = useState([]);
  const [emotionsPercentage, setEmotionsPercentage] = useState({});
  const [emotionsCount, setEmotionsCount] = useState({});
  const [lastEmotion, setLastEmotion] = useState({});
  const [aggreagations, setAggreagations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/text/textemotions")
      .then((response) => {
        setEmotions(response.data.emotions);
      })
      .catch((error) => {
        console.error("Error fetching emotions:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/api/text/textaggregateemotions")
      .then((response) => {
        setAggreagations(response.data.emotions)
        setAggreagationsHourly(response.data.emotionshourly)
        console.log("res",response.data.emotionshourly)
      })
      .catch((error) => { 
        console.error("Error fetching emotions:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/api/text/textemotionsprecnetages")
      .then((response) => {
        const percentages = response.data.percentages;
        const counts = response.data.counts;
        const lastpercentage = response.data.emotionLastPercentages;
        const formattedPercentages = Object.fromEntries(
          Object.entries(percentages).map(([emotion, value]) => [
            emotion,
            parseFloat(value) 
          ])
        );
        const formattedLastPercentages = Object.fromEntries(
          Object.entries(lastpercentage).map(([emotion, value]) => [
            emotion,
            parseFloat(value) 
          ])
        );
        const formattedCounts = Object.fromEntries(
          Object.entries(counts).map(([emotion, value]) => [
            emotion,
            parseFloat(value) 
          ])
        );
        setEmotionsPercentage(formattedPercentages);
        setEmotionsCount(formattedCounts);
        setLastEmotion(formattedLastPercentages)
      })
      .catch((error) => {
        console.error("Error fetching emotions percentages:", error);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(emotionsPercentage).length > 0) {
      console.log("Emotion Percentages state:", emotionsPercentage);
    }
  }, [emotionsPercentage]); 

  useEffect(() => {
    if (Object.keys(emotionsCount).length > 0) {
      console.log("Emotion Counts state:", emotionsCount);
    }
  }, [emotionsCount]); 
  useEffect(() => {
    if (Object.keys(lastEmotion).length > 0) {
      console.log("Emotion Counts state:", lastEmotion);
    }
  }, [lastEmotion]); 


  return (
    <div>
      {aggreagations.length > 0 && (
        <EmotionAggregationChart
          emotions={aggreagations}
          emotionsHourly={aggreagationsHourly}
        />
      )}
      {Object.keys(emotionsPercentage).length > 0 &&
        Object.keys(emotionsCount).length > 0 && Object.keys(emotionsCount).length > 0 && Object.keys(lastEmotion).length > 0 && (
          <EmotionPercentageChart
            emotions={emotionsPercentage}
            emotionCount={emotionsCount}
            lastEmotion={lastEmotion}
          />
        )}
      {emotions.length > 0 && <EmotionChart emotions={emotions} />}
    </div>
  );
};

export default TextPrediction;