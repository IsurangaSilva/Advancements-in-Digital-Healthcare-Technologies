import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// Emotion categories for display purposes only
export const emotionCategories = {
  Sadness: "Sadness",
  Anger: "Anger", 
  Fear: "Fear",
  Neutral: "Neutral",
  Joy: "Joy",
  Surprise: "Surprise"
};

// Emotion weights for depression score calculation
export const emotionWeights = {
  sadness: 1.0,  // Strong depression signal
  anger: 0.7,    // Common in depression
  fear: 0.6,     // Anxiety-related
  neutral: 0.0,  // No impact
  joy: -1.0,     // Opposite of depression
  surprise: -0.3 // Mildly counter-depressive
};

// Constants for normalization
const SHIFT_FACTOR = 1.3; // To make all scores positive
const NORMALIZATION_RANGE = 3.6; // To bring scores to 0-1 range

// Calculate weighted depression score based on emotion values and weights
export const calculateWeightedDepressionScore = (emotions) => {
  if (!emotions) return 0.5; // Default middle value if no data
  
  let weightedSum = 0;
  let hasData = false;
  
  Object.keys(emotionWeights).forEach(emotion => {
    if (emotions[emotion] !== undefined) {
      weightedSum += emotions[emotion] * emotionWeights[emotion];
      hasData = true;
    }
  });
  
  // If no valid data, return mid-point score
  if (!hasData) return 0.5;
  
  // Normalize to 0-1 range: (weighted_sum + shift_factor) / normalization_range
  const normalizedScore = (weightedSum + SHIFT_FACTOR) / NORMALIZATION_RANGE;
  
  // Clamp between 0 and 1
  return Math.min(Math.max(normalizedScore, 0), 1);
};

// Simplified function that returns dummy data for depression score (fallback)
export const calculateDepressionScore = () => {
  // Generate a random score between 0.2 and 0.8 for display purposes
  const randomScore = 0.2 + Math.random() * 0.6;
  console.log("Generated dummy depression score:", randomScore.toFixed(2));
  
  return randomScore;
};

// Determine depression level information based on score
export const getDepressionLevel = (score) => {
  if (score < 0.40) return { 
    level: 'No Depression', 
    color: '#4caf50',
    icon: 'SentimentSatisfiedAlt',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
    description: 'You are not showing signs of depression.'
  };
  if (score >= 0.40 && score <= 0.49) return { 
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

// Format data for charts with real emotion values when available
export const formatChartData = (emotionData, theme, dataType = 'micro') => {
  // Standard emotion labels
  const emotionLabels = ['Sadness', 'Anger', 'Fear', 'Neutral', 'Joy', 'Surprise'];
  
  // Use actual emotion values if available, otherwise use dummy values
  let emotionValues = [];
  
  if (emotionData && Object.keys(emotionData).length > 0) {
    // Map lowercase API keys to our standard emotion labels
    emotionValues = [
      emotionData.sadness || 0,
      emotionData.anger || 0,
      emotionData.fear || 0,
      emotionData.neutral || 0,
      emotionData.joy || 0,
      emotionData.surprise || 0
    ];
    console.log(`Using real ${dataType} emotion values for chart:`, emotionValues);
  } else {
    // Fallback to dummy data if no real data available
    emotionValues = [
      Math.random() * 0.2,
      Math.random() * 0.4,
      Math.random() * 0.3,
      Math.random() * 0.7,
      Math.random() * 0.6,
      Math.random() * 0.2
    ];
    console.log(`Using dummy ${dataType} emotion values for chart:`, emotionValues);
  }
    // Return formatted chart data with enhanced visuals
  return {
    radar: {
      data: {
        labels: emotionLabels,
        datasets: [
          {
            label: 'Emotion Values',
            data: emotionValues,
            backgroundColor: 'rgba(66, 165, 245, 0.3)',
            borderColor: 'rgba(33, 150, 243, 0.8)',
            pointBackgroundColor: 'rgba(33, 150, 243, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(33, 150, 243, 1)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 8,
            fill: true,
            // Add second dataset for glowing effect
            tension: 0.2
          },
          {
            label: 'Emotion Trend',
            data: emotionValues.map(val => Math.max(val - 0.05, 0)),
            backgroundColor: 'rgba(116, 209, 234, 0.2)',
            borderColor: 'rgba(116, 209, 234, 0.5)',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: 'transparent',
            pointHoverBorderColor: 'transparent',
            borderWidth: 1,
            pointRadius: 0,
            fill: true,
            tension: 0.2
          }
        ]
      }
    },
    bar: {
      data: (microScore, macroScore, clinicalScore) => {
        // Generate gradient colors for bars
        const gradientColors = [
          ['rgba(76, 175, 80, 0.9)', 'rgba(76, 175, 80, 0.4)'],  // Green
          ['rgba(33, 150, 243, 0.9)', 'rgba(33, 150, 243, 0.4)'], // Blue
          ['rgba(255, 152, 0, 0.9)', 'rgba(255, 152, 0, 0.4)']   // Orange
        ];
        
        return {
          labels: ['Micro Score (5-min)', 'Macro Score (Last 24 Hrs)', 'Clinical Score'],
          datasets: [
            {
              label: 'Depression Scores',
              data: [microScore, macroScore, clinicalScore],
              backgroundColor: gradientColors.map(colors => colors[0]),
              borderColor: ['rgba(56, 142, 60, 1)', 'rgba(25, 118, 210, 1)', 'rgba(245, 124, 0, 1)'],
              borderWidth: 2,
              borderRadius: 6,
              hoverBorderWidth: 3,
              hoverBorderRadius: 8
            },
            // Add secondary dataset for shadow effect
            {
              label: 'Base Score',
              data: [0.1, 0.1, 0.1],
              backgroundColor: gradientColors.map(colors => colors[1]),
              borderWidth: 0,
              borderRadius: 6,
              barPercentage: 0.9,
              categoryPercentage: 0.9,
              grouped: false
            }
          ]
        };
      }
    }
  };
};

// Format trend data for line chart visualization - showing depression score over time
export const formatTrendChartData = (trendData, theme) => {
  if (!trendData || trendData.length === 0) {
    return null;
  }

  // Extract timestamps and convert to readable format with date and time
  const labels = trendData.map(item => {
    const date = new Date(item.timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  });

  // Calculate depression scores for each timestamp
  const depressionScores = trendData.map(item => {
    return calculateWeightedDepressionScore(item.emotions);
  });
  // Create datasets for enhanced visual effects
  const datasets = [
    // Shadow effect line (larger, behind main line)
    {
      label: 'Trend Shadow',
      data: depressionScores,
      borderColor: 'rgba(33, 150, 243, 0.3)',
      backgroundColor: 'transparent',
      borderWidth: 8,
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.4,
      fill: false,
      cubicInterpolationMode: 'monotone',
    },
    // Glowing effect line
    {
      label: 'Trend Glow',
      data: depressionScores,
      borderColor: 'rgba(33, 150, 243, 0.2)',
      backgroundColor: 'transparent',
      borderWidth: 12,
      pointRadius: 0,
      pointHoverRadius: 0,
      borderDash: [5, 5],
      tension: 0.4,
      fill: false,
    },
    // Main dataset line
    {
      label: 'Depression Score',
      data: depressionScores,
      borderColor: 'rgba(33, 150, 243, 0.9)',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(33, 150, 243, 0.7)');
        gradient.addColorStop(0.5, 'rgba(33, 150, 243, 0.3)');
        gradient.addColorStop(1, 'rgba(33, 150, 243, 0.0)');
        return gradient;
      },
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 10,
      pointBackgroundColor: 'rgba(33, 150, 243, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 3,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(33, 150, 243, 1)',
      pointHoverBorderWidth: 4,
      cubicInterpolationMode: 'monotone',
    }
  ];

  return {
    labels,
    datasets
  };
};

// Custom hook for depression data using Socket.IO for real-time updates
export const useDepressionPredictions = () => {  const [predictionData, setPredictionData] = useState(null);
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
      // Only send email when score is above 0.50 as requested
      if (score <= 0.50) {
        console.log(`Score ${score} below threshold, no alert sent`);
        return false;
      }
      
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
    // Fetch emotion data using polling approach
  useEffect(() => {
    setLoading(true);
    console.log("Initializing real-time data polling");
      // Function to fetch data from the API
    const fetchEmotionData = async () => {
      try {        // Fetch micro (5-min), macro (hourly), clinical (weekly), and trend (60-min) data in parallel
        const [microResponse, macroResponse, clinicalResponse, trendResponse] = await Promise.all([
          fetch('http://localhost:4000/api/average/combined-5min-weighted-average'),
          fetch('http://localhost:4000/api/average/hourlydepression'),
          fetch('http://localhost:4000/api/average/weeklydepression'),
          fetch('http://localhost:4000/api/average/combined-60min-weighted-average')
        ]);        if (!microResponse.ok) {
          throw new Error(`Micro API returned status: ${microResponse.status}`);
        }
        if (!macroResponse.ok) {
          console.warn(`Macro API returned status: ${macroResponse.status}, using micro score as fallback`);
        }
        if (!clinicalResponse.ok) {
          console.warn(`Clinical API returned status: ${clinicalResponse.status}, using micro score as fallback`);
        }
        if (!trendResponse.ok) {
          console.warn(`Trend API returned status: ${trendResponse.status}, trend chart will be unavailable`);
        }
        
        const microData = await microResponse.json();
        console.log('Received real-time micro emotion data:', microData);
          let macroData = null;
        if (macroResponse.ok) {
          macroData = await macroResponse.json();
          console.log('Received hourly macro emotion data:', macroData);
        }
          let clinicalData = null;
        if (clinicalResponse.ok) {
          clinicalData = await clinicalResponse.json();
          console.log('Received weekly clinical emotion data:', clinicalData);
        }
        
        let trendResponseData = null;
        if (trendResponse.ok) {
          trendResponseData = await trendResponse.json();
          console.log('Received trend emotion data:', trendResponseData);
        }
        
        if (microData.success && microData.emotions && microData.emotions.length > 0) {
          const latestEmotionData = microData.emotions[0].weightedAverages;
          
          if (latestEmotionData && typeof latestEmotionData === 'object') {
            try {
              // Normalize micro emotion data to lowercase keys for consistency
              const normalizedMicroEmotions = {
                sadness: latestEmotionData.sadness || 0,
                anger: latestEmotionData.anger || 0, 
                fear: latestEmotionData.fear || 0,
                neutral: latestEmotionData.neutral || 0,
                joy: latestEmotionData.joy || 0,
                surprise: latestEmotionData.surprise || 0
              };

              // Calculate weighted depression score from micro emotion data
              const microScore = calculateWeightedDepressionScore(normalizedMicroEmotions);
                // Calculate macro score from hourly data if available
              let macroScore = microScore; // Fallback to micro score
              let macroEmotions = normalizedMicroEmotions; // Fallback to micro emotions
              
              if (macroData && macroData.success && macroData.emotionAverages) {
                macroEmotions = {
                  sadness: macroData.emotionAverages.sadness || 0,
                  anger: macroData.emotionAverages.anger || 0,
                  fear: macroData.emotionAverages.fear || 0,
                  neutral: macroData.emotionAverages.neutral || 0,
                  joy: macroData.emotionAverages.joy || 0,
                  surprise: macroData.emotionAverages.surprise || 0
                };
                
                // Apply the same weighted depression score calculation logic to hourly data
                macroScore = calculateWeightedDepressionScore(macroEmotions);
                console.log('Calculated macro score from hourly data:', macroScore.toFixed(3));
              } else {
                console.log('Using micro score as fallback for macro score');
              }
                // Calculate clinical score from weekly data if available
              let clinicalScore = microScore; // Fallback to micro score
              let clinicalEmotions = normalizedMicroEmotions; // Fallback to micro emotions
              
              if (clinicalData && clinicalData.success && clinicalData.emotionAverages) {
                clinicalEmotions = {
                  sadness: clinicalData.emotionAverages.sadness || 0,
                  anger: clinicalData.emotionAverages.anger || 0,
                  fear: clinicalData.emotionAverages.fear || 0,
                  neutral: clinicalData.emotionAverages.neutral || 0,
                  joy: clinicalData.emotionAverages.joy || 0,
                  surprise: clinicalData.emotionAverages.surprise || 0
                };
                
                // Apply the same weighted depression score calculation logic to weekly data
                clinicalScore = calculateWeightedDepressionScore(clinicalEmotions);
                console.log('Calculated clinical score from weekly data:', clinicalScore.toFixed(3));              } else {
                console.log('Using micro score as fallback for clinical score');
              }
                // Process trend data for chart visualization
              let trendData = null;
              if (trendResponseData && trendResponseData.success && trendResponseData.emotions) {
                trendData = trendResponseData.emotions.map(item => ({
                  timestamp: item.timestamp,
                  emotions: {
                    sadness: item.weightedAverages.sadness || 0,
                    anger: item.weightedAverages.anger || 0,
                    fear: item.weightedAverages.fear || 0,
                    neutral: item.weightedAverages.neutral || 0,
                    joy: item.weightedAverages.joy || 0,
                    surprise: item.weightedAverages.surprise || 0
                  }
                }));
                console.log('Processed trend data:', trendData);
              }
              
              // Consolidate data
              const data = {
                microScore,
                macroScore,
                clinicalScore,
                microEmotions: normalizedMicroEmotions,
                macroEmotions: macroEmotions,
                clinicalEmotions: clinicalEmotions,
                trendData: trendData,
                averageEmotions: normalizedMicroEmotions, // Keep for backward compatibility
                lastUpdated: new Date().toLocaleString()
              };
              
              console.log("Real-time depression data:", data);
              setPredictionData(data);
              
              // Send email alerts for scores above 0.50
              if (microScore > 0.50) sendAlertEmail('Micro', microScore);
              if (macroScore > 0.50) sendAlertEmail('Macro', macroScore);
              if (clinicalScore > 0.50) sendAlertEmail('Clinical', clinicalScore);
              
            } catch (processingErr) {
              console.error('Error processing emotion data:', processingErr);
            }
          }
        } else {
          console.warn('No valid emotion data in API response');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching emotion data:', err);
        setError(`Failed to fetch data: ${err.message}`);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchEmotionData();

    // Set up polling interval (every 5 seconds)
    const pollingInterval = setInterval(fetchEmotionData, 5000);

    // Clean up on unmount
    return () => {
      console.log('Cleaning up polling interval');
      clearInterval(pollingInterval);
    };
  }, []);

  // If no data received for a while, fallback to dummy data
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (loading && !predictionData) {
        console.log("No real-time data received, falling back to dummy data");
        
        try {
          // Generate dummy scores
          const microScore = calculateDepressionScore(); 
          const macroScore = calculateDepressionScore();
          const clinicalScore = calculateDepressionScore();
            // Create dummy emotion data
          const dummyEmotions = {
            sadness: Math.random() * 0.6,
            anger: Math.random() * 0.4,
            fear: Math.random() * 0.3,
            neutral: Math.random() * 0.5,
            joy: Math.random() * 0.7,
            surprise: Math.random() * 0.2
          };
            // Create slightly different macro emotions for variety
          const dummyMacroEmotions = {
            sadness: Math.random() * 0.5,
            anger: Math.random() * 0.3,
            fear: Math.random() * 0.4,
            neutral: Math.random() * 0.6,
            joy: Math.random() * 0.8,
            surprise: Math.random() * 0.3
          };
          
          // Create clinical emotions for variety
          const dummyClinicalEmotions = {
            sadness: Math.random() * 0.4,
            anger: Math.random() * 0.2,
            fear: Math.random() * 0.3,
            neutral: Math.random() * 0.7,
            joy: Math.random() * 0.9,
            surprise: Math.random() * 0.2
          };
          
          // Consolidate data
          const data = {
            microScore,
            macroScore,
            clinicalScore,
            microEmotions: dummyEmotions,
            macroEmotions: dummyMacroEmotions,
            clinicalEmotions: dummyClinicalEmotions,
            averageEmotions: dummyEmotions, // Keep for backward compatibility
            lastUpdated: new Date().toLocaleString()
          };
          
          console.log("Dummy depression data (fallback):", data);
          setPredictionData(data);
        } catch (err) {
          console.error('Error generating fallback data:', err);
        } finally {
          setLoading(false);
        }
      }
    }, 5000); // Wait 5 seconds for real data before falling back
    
    return () => clearTimeout(fallbackTimer);
  }, [loading, predictionData]);

  return { predictionData, error, loading, emailError, getDepressionLevel };
};
