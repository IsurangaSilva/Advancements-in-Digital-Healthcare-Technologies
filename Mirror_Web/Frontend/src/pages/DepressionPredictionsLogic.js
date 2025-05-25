/**
 * DepressionPredictionsLogic.js
 * 
 * This module contains the business logic and data handling for depression predictions:
 * - API calls to fetch depression data
 * - Depression score calculation algorithm
 * - Data formatting for charts
 * - Classification of depression levels
 */

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// Clinical emotion weights for depression calculation
export const emotionWeights = {
  Sadness: 1.0,   // Core symptom of depression - highest weight
  Anger: 0.7,     // Often reflects irritability and negative affect in depression 
  Fear: 0.6,      // Anxiety and worry frequently comorbid with depression
  Neutral: 0.0,   // No direct contribution to depression score
  Joy: -1.0,      // Opposite of depressive state - reduces score significantly
  Surprise: -0.3  // Linked to arousal/curiosity - mildly reduces depression
};

// Calculate depression score based on emotions
export const calculateDepressionScore = (emotions) => {
  // Data validation - verify we have emotion data
  if (!emotions || typeof emotions !== 'object') {
    console.error("Invalid emotions input:", emotions);
    return 0; // Default to 0 for invalid input
  }
  
  // Verify some emotion values exist (even if 0)
  const hasEmotionData = Object.keys(emotions).some(key => 
    emotions[key] !== undefined && emotions[key] !== null);
  
  if (!hasEmotionData) {
    console.warn("No valid emotion data found:", emotions);
    return 0; // Default to 0 when no valid data
  }
  
  // Extract emotions
  const sadness = emotions.Sadness || emotions.sadness || 0;
  const anger = emotions.Anger || emotions.anger || 0;
  const fear = emotions.Fear || emotions.fear || 0;
  const neutral = emotions.Neutral || emotions.neutral || 0;
  const joy = emotions.Joy || emotions.joy || emotions.Happy || emotions.happy || 0;
  const surprise = emotions.Surprise || emotions.surprise || 0;
  
  // Apply weights and calculate score
  const rawScore = 
    (sadness * emotionWeights.Sadness) +
    (anger * emotionWeights.Anger) +
    (fear * emotionWeights.Fear) +
    (neutral * emotionWeights.Neutral) +
    (joy * emotionWeights.Joy) +
    (surprise * emotionWeights.Surprise);
  
  const shiftedScore = rawScore + 1.3;
  const normalizedScore = shiftedScore / 3.6;
  
  // Ensure score is within [0, 1] range
  return Math.max(0, Math.min(1, normalizedScore));
};

// Determine depression level information based on score
export const getDepressionLevel = (score) => {
  if (score < 0.30) return { 
    level: 'No Depression', 
    color: '#4caf50',
    icon: 'SentimentSatisfiedAlt',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
    description: 'You are not showing signs of depression.'
  };
  if (score >= 0.30 && score <= 0.49) return { 
    level: 'Mild Depression', 
    color: '#8bc34a',
    icon: 'SentimentNeutral',
    gradient: 'linear-gradient(135deg, #8bc34a 0%, #aed581 100%)',
    description: 'You are showing mild signs of depression. Monitor your mood.'
  };
  if (score >= 0.50 && score <= 0.69) return { 
    level: 'Moderate', 
    color: '#ff9800',
    icon: 'SentimentDissatisfied',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
    description: 'You are showing moderate signs of depression. Consider seeking support.'
  };
  if (score >= 0.70 && score <= 0.85) return { 
    level: 'Severe', 
    color: '#f44336',
    icon: 'SentimentVeryDissatisfied',
    gradient: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
    description: 'You are showing severe signs of depression. Please consult a healthcare professional.'
  };
  return { 
    level: 'Very Severe', 
    color: '#d32f2f',
    icon: 'SentimentVeryDissatisfied',
    gradient: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
    description: 'You are showing very severe signs of depression. Urgent professional help is recommended.'
  };
};

// Format data for charts
export const formatChartData = (emotionData, theme) => {
  // Extract emotions
  const emotionLabels = ['Sadness', 'Anger', 'Fear', 'Neutral', 'Joy', 'Surprise'];
  const emotionValues = [
    emotionData.Sadness || emotionData.sadness || 0,
    emotionData.Anger || emotionData.anger || 0,
    emotionData.Fear || emotionData.fear || 0,
    emotionData.Neutral || emotionData.neutral || 0,
    emotionData.Joy || emotionData.joy || emotionData.Happy || emotionData.happy || 0,
    emotionData.Surprise || emotionData.surprise || 0
  ];
  
  // Weight values for visualization
  const weightValues = [
    emotionWeights.Sadness,
    emotionWeights.Anger,
    emotionWeights.Fear,
    emotionWeights.Neutral,
    emotionWeights.Joy,
    emotionWeights.Surprise
  ];
  
  // Return formatted chart data
  return {
    radar: {
      data: {
        labels: emotionLabels,
        datasets: [
          {
            label: 'Emotion Values',
            data: emotionValues,
            backgroundColor: 'rgba(66, 165, 245, 0.2)',
            borderColor: 'rgba(33, 150, 243, 1)',
            pointBackgroundColor: 'rgba(33, 150, 243, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(33, 150, 243, 1)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Depression Contribution',
            data: emotionValues.map((val, idx) => Math.abs(val * weightValues[idx])),
            backgroundColor: 'rgba(244, 67, 54, 0.15)',
            borderColor: 'rgba(244, 67, 54, 0.7)',
            pointBackgroundColor: 'rgba(244, 67, 54, 0.7)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(244, 67, 54, 1)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      }
    },
    bar: {
      data: (microScore, macroScore, clinicalScore) => ({
        labels: ['Micro Score (5-min)', 'Macro Score (Last 24 Hrs)', 'Clinical Score'],
        datasets: [
          {
            label: 'Depression Scores',
            data: [microScore, macroScore, clinicalScore],
            backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
            borderColor: ['#388e3c', '#1976d2', '#f57c00'],
            borderWidth: 1
          }
        ]
      })
    }
  };
};

// Custom hook for depression data
export const useDepressionPredictions = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailError, setEmailError] = useState(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('D7VczC01i0Q9NyruI');
  }, []);

  // Function to send email alert
  const sendAlertEmail = async (scoreType, score) => {
    try {
      const response = await emailjs.send(
        'service_db8tebr',
        'template_1w32sle',
        {
          score_type: scoreType,
          score_value: score.toFixed(2),
          date: new Date().toLocaleString()
        }
      );
      console.log(`Email sent for ${scoreType} score: ${score}`, response);
      return true;
    } catch (err) {
      console.error('Email alert error:', err);
      setEmailError(`Failed to send alert email for ${scoreType} score: ${err.text || 'Unknown error'}`);
      return false;
    }
  };

  // Fetch depression data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both 5-min and 60-min data simultaneously
        const [microResponse, macroResponse] = await Promise.all([
          fetch('http://localhost:4000/api/average/combined-5min-weighted-average'),
          fetch('http://localhost:4000/api/average/60min-weighted-average')
        ]);
        
        const microResult = await microResponse.json();
        const macroResult = await macroResponse.json();
        
        if (microResult.error) {
          setError(microResult.error);
          return;
        }
        
        // Extract emotion data for calculations
        let apiEmotions = {};
        let dataSource = "unknown";
        
        // Check all possible places where emotion data might be located
        if (microResult.averageEmotions && Object.keys(microResult.averageEmotions).length > 0) {
          apiEmotions = microResult.averageEmotions;
          dataSource = "averageEmotions";
        } else if (microResult.weightedAverages && Object.keys(microResult.weightedAverages).length > 0) {
          apiEmotions = microResult.weightedAverages;
          dataSource = "weightedAverages";
        } else if (microResult.rawData?.weightedAverages) {
          apiEmotions = microResult.rawData.weightedAverages;
          dataSource = "rawData.weightedAverages";
        }
        
        // Normalize emotion keys
        const averageEmotions = {
          Sadness: apiEmotions.Sadness || apiEmotions.sadness || apiEmotions.Sad || apiEmotions.sad || 0,
          Anger: apiEmotions.Anger || apiEmotions.anger || 0,
          Fear: apiEmotions.Fear || apiEmotions.fear || 0,
          Neutral: apiEmotions.Neutral || apiEmotions.neutral || 0,
          Joy: apiEmotions.Joy || apiEmotions.joy || apiEmotions.Happy || apiEmotions.happy || 0,
          Surprise: apiEmotions.Surprise || apiEmotions.surprise || 0
        };
        
        // Calculate micro score (5-min data)
        const microScore = calculateDepressionScore(averageEmotions);
        
        // Process macro data (60-min)
        let macroScore = 0;
        let macroScoreSource = "default";
        let macroEmotions = null;
        
        if (macroResult && macroResult.success) {
          if (macroResult.macroScore !== undefined) {
            // Use pre-calculated score from backend
            macroScore = macroResult.macroScore;
            macroScoreSource = "pre-calculated";
          } else if (macroResult.averageEmotions || macroResult.weightedAverages) {
            const macroEmotionData = macroResult.averageEmotions || macroResult.weightedAverages || {};
            macroEmotions = macroEmotionData;
            macroScore = calculateDepressionScore(macroEmotionData);
            macroScoreSource = "calculated-frontend";
          }
        }
        
        // Get clinical score (long-term data if available)
        const clinicalScore = microResult.clinicalScore || microResult.clinicalDepressionScore || 0;
          
        // Consolidate data
        const data = {
          microScore,
          macroScore,
          clinicalScore,
          averageEmotions,
          macroData: {
            ...macroResult,
            recordCount: macroResult.recordCount || 24,
            timestamp: macroResult.timestamp || new Date().toISOString(),
          },
          dataSource,
          lastUpdated: new Date().toLocaleString()
        };
        
        setPredictionData(data);
        
        // Check for high scores and send email alerts
        if (microScore > 0.85) await sendAlertEmail('Micro', microScore);
        if (macroScore > 0.85) await sendAlertEmail('Macro', macroScore);
        if (clinicalScore > 0.85) await sendAlertEmail('Clinical', clinicalScore);
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch depression prediction data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return { predictionData, error, loading, emailError, getDepressionLevel };
};
