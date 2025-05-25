import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  Tooltip as MuiTooltip,
  Chip,
  Avatar
} from '@mui/material';

/**
 * DepressionPredictions Component
 * 
 * This component implements a clinical algorithm for depression score calculation based on emotional analysis:
 * 
 * 1. Algorithm steps (ONLY APPLIED TO MICRO SCORE):
 *    - Extract individual emotion values (Sadness, Anger, Fear, Neutral, Joy, Surprise)
 *    - Apply clinical weights to each emotion (positive weights increase depression score, negative reduce it)
 *    - Sum all weighted emotion contributions to get raw score
 *    - Add 1.3 to the raw score to normalize (shift from negative range to positive)
 *    - Divide by 3.6 to scale to [0,1] range
 *    - Clamp final result to ensure it's within [0,1]
 * 
 * 2. Score Types:
 *    - Micro Score (5-min): Calculated from weighted averages using the algorithm
 *    - Macro Score (hourly): Directly from API, not calculated
 *    - Clinical Score (overall): Directly from API, not calculated
 * 
 * 3. Visualization components:
 *    - Radar chart showing emotion distribution and depression contributions
 *    - Bar chart comparing different time-window scores
 *    - Score indicator cards with clinical interpretation
 *    - Debug panel showing detailed calculation for micro score only
 * 
 * 4. Score interpretation:
 *    - 0.00-0.30: No Depression
 *    - 0.30-0.49: Mild Depression
 *    - 0.50-0.69: Moderate Depression
 *    - 0.70-0.85: Severe Depression
 *    - 0.85-1.00: Very Severe Depression
 * 
 * 5. Data Flow:
 *    - Backend provides the weighted averages and other raw data
 *    - Frontend extracts emotion values with fallback strategies
 *    - Micro score is calculated from the emotion values
 *    - Macro and clinical scores taken directly from API
 */

import PsychologyIcon from '@mui/icons-material/Psychology';
import BarChartIcon from '@mui/icons-material/BarChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import InfoIcon from '@mui/icons-material/Info';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import emailjs from '@emailjs/browser';

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const DepressionPredictions = () => {
  const theme = useTheme();
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [loading, setLoading] = useState(true);
  const barChartRef = useRef(null);
  const radarChartRef = useRef(null);
  // Clinical emotion weights - make sure these match the normalized emotion keys from API
  /**
   * Clinical emotion weights for depression calculation
   * 
   * These weights are based on established clinical correlations between emotions and depression:
   * - Positive weights increase depression score (emotions positively correlated with depression)
   * - Negative weights decrease depression score (emotions negatively correlated with depression)
   * - Values represent relative strength of correlation with depression
   * 
   * The weight values are calibrated so that:
   * 1. Maximum theoretical score (full sadness, anger, fear) is approximately +2.3
   * 2. Minimum theoretical score (full joy, surprise) is approximately -1.3
   * 3. When normalized with +1.3 shift and /3.6 division, the range becomes [0,1]
   */
  const emotionWeights = {
    Sadness: 1.0,   // Core symptom of depression - highest weight
    Anger: 0.7,     // Often reflects irritability and negative affect in depression 
    Fear: 0.6,      // Anxiety and worry frequently comorbid with depression
    Neutral: 0.0,   // No direct contribution to depression score
    Joy: -1.0,      // Opposite of depressive state - reduces score significantly
    Surprise: -0.3  // Linked to arousal/curiosity - mildly reduces depression
  };
  
  console.log("Using depression clinical weights:", emotionWeights);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('D7VczC01i0Q9NyruI'); // Replace with your EmailJS User ID
  }, []);

  // Function to send email alert using EmailJS
  const sendAlertEmail = async (scoreType, score) => {
    try {
      const response = await emailjs.send(
        'service_db8tebr', // Replace with your EmailJS Service ID
        'template_1w32sle', // Replace with your EmailJS Template ID
      );
      console.log(`Email sent for ${scoreType} score: ${score}`, response);
    } catch (err) {
      console.error('Email alert error:', err);
      const errorMessage = err.text || 'Unknown error';
      setEmailError(`Failed to send alert email for ${scoreType} score: ${errorMessage}. Please check EmailJS configuration.`);
    }
  };  // Calculate depression score based on emotions
  const calculateDepressionScore = (emotions) => {
    console.log("Calculating depression score for emotions:", emotions);
    
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
    
    // Step 1: Get emotions separately
    const sadness = emotions.Sadness || 0;
    const anger = emotions.Anger || 0;
    const fear = emotions.Fear || 0;
    const neutral = emotions.Neutral || 0;
    const joy = emotions.Joy || 0;
    const surprise = emotions.Surprise || 0;
    
    console.log("Individual emotions extracted:", { sadness, anger, fear, neutral, joy, surprise });
    
    // Step 2 & 3: Multiply emotions by their clinical weights and sum them
    const weightedSadness = sadness * emotionWeights.Sadness;
    const weightedAnger = anger * emotionWeights.Anger;
    const weightedFear = fear * emotionWeights.Fear;
    const weightedNeutral = neutral * emotionWeights.Neutral;
    const weightedJoy = joy * emotionWeights.Joy; // Note: this is negative as joy counters depression
    const weightedSurprise = surprise * emotionWeights.Surprise; // Also likely negative
    
    // Create detailed breakdown for debugging
    const emotionScores = {
      Sadness: { value: sadness, weight: emotionWeights.Sadness, weightedScore: weightedSadness },
      Anger: { value: anger, weight: emotionWeights.Anger, weightedScore: weightedAnger },
      Fear: { value: fear, weight: emotionWeights.Fear, weightedScore: weightedFear },
      Neutral: { value: neutral, weight: emotionWeights.Neutral, weightedScore: weightedNeutral },
      Joy: { value: joy, weight: emotionWeights.Joy, weightedScore: weightedJoy },
      Surprise: { value: surprise, weight: emotionWeights.Surprise, weightedScore: weightedSurprise }
    };
    
    console.log("Emotion scores with weights applied:", emotionScores);
    
    // Step 3: Calculate raw score (sum of all weighted emotions)
    const rawScore = weightedSadness + weightedAnger + weightedFear + 
                     weightedNeutral + weightedJoy + weightedSurprise;
    
    console.log("Raw depression score (sum of weighted emotions):", rawScore);
    
    // Step 4: Add 1.3 to normalize (shift the range)
    const shiftedScore = rawScore + 1.3;
    console.log("Shifted score (raw score + 1.3):", shiftedScore);
    
    // Step 5: Divide by 3.6 to get final score in [0,1] range
    const normalizedScore = shiftedScore / 3.6;
    console.log("Normalized score (shifted score / 3.6):", normalizedScore);
    
    // Ensure score is within [0, 1] range
    const finalScore = Math.max(0, Math.min(1, normalizedScore));
    console.log("Final clamped depression score:", finalScore);
    
    return finalScore;
  };  // Fetch data and calculate scores
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
        
        console.log("Micro API response:", microResult);
        console.log("Macro API response:", macroResult);
        
        if (microResult.error) {
          setError(microResult.error);
          return;
        }
        
        // STEP 1: Extract emotion data for micro (5-minute) calculations
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
        } else if (microResult.emotions && microResult.emotions.length > 0) {
          const latestEmotion = microResult.emotions[0];
          
          if (latestEmotion.weightedAverages) {
            apiEmotions = latestEmotion.weightedAverages;
            dataSource = "emotions[0].weightedAverages";
          } else if (latestEmotion.session_aggregate) {
            apiEmotions = latestEmotion.session_aggregate;
            dataSource = "emotions[0].session_aggregate";
          }
        }
        
        console.log("Micro data source used:", dataSource);
        
        // STEP 2: Normalize emotion keys to support all different format variations
        const averageEmotions = {
          Sadness: apiEmotions.Sadness || apiEmotions.sadness || apiEmotions.Sad || apiEmotions.sad || 0,
          Anger: apiEmotions.Anger || apiEmotions.anger || 0,
          Fear: apiEmotions.Fear || apiEmotions.fear || 0,
          Neutral: apiEmotions.Neutral || apiEmotions.neutral || 0,
          Joy: apiEmotions.Joy || apiEmotions.joy || apiEmotions.Happy || apiEmotions.happy || 0,
          Surprise: apiEmotions.Surprise || apiEmotions.surprise || 0
        };
        
        // STEP 3: Calculate micro score (5-min data)
        const microScore = calculateDepressionScore(averageEmotions);
        console.log("Micro score (5-min) from weighted averages algorithm:", microScore);
        
        // STEP 4: Process macro data (60-min)
        let macroScore = 0;
        let macroScoreSource = "default";
        let macroEmotions = null;
        
        if (macroResult && macroResult.success) {          if (macroResult.macroScore !== undefined) {
            // Use pre-calculated score from backend
            macroScore = macroResult.macroScore;
            macroScoreSource = "pre-calculated";
            
            // Even if we have pre-calculated score, we still want emotion values for the debug display
            if (macroResult.averageEmotions || macroResult.weightedAverages) {
              const emotionSource = macroResult.averageEmotions || macroResult.weightedAverages;
              macroEmotions = {
                Sadness: emotionSource.Sadness || emotionSource.sadness || 0,
                Anger: emotionSource.Anger || emotionSource.anger || 0,
                Fear: emotionSource.Fear || emotionSource.fear || 0,
                Neutral: emotionSource.Neutral || emotionSource.neutral || 0,
                Joy: emotionSource.Joy || emotionSource.joy || emotionSource.Happy || emotionSource.happy || 0,
                Surprise: emotionSource.Surprise || emotionSource.surprise || 0
              };
            }          } else if (macroResult.averageEmotions || macroResult.weightedAverages) {
            // Get the emotion data from the 60-min API (try both possible formats)
            const emotionSource = macroResult.averageEmotions || macroResult.weightedAverages;
            macroEmotions = {
              Sadness: emotionSource.Sadness || emotionSource.sadness || 0,
              Anger: emotionSource.Anger || emotionSource.anger || 0,
              Fear: emotionSource.Fear || emotionSource.fear || 0,
              Neutral: emotionSource.Neutral || emotionSource.neutral || 0,
              Joy: emotionSource.Joy || emotionSource.joy || emotionSource.Happy || emotionSource.happy || 0,
              Surprise: emotionSource.Surprise || emotionSource.surprise || 0
            };
            
            // Calculate from the provided average emotions
            macroScore = calculateDepressionScore(macroEmotions);
            macroScoreSource = "calculated-from-averages";
          }
          
          console.log(`Macro score (60-min, ${macroScoreSource}):`, macroScore);
          console.log("Records used for macro score calculation:", macroResult.recordCount || "unknown");
        } else {
          console.warn("Failed to fetch macro data, defaulting to 0");
        }
        
        // STEP 5: Get clinical score (long-term data if available)
        const clinicalScore = microResult.clinicalScore || microResult.clinicalDepressionScore || 0;
        console.log("Clinical score:", clinicalScore);
          // Consolidate all data
        const data = {
          ...microResult,
          microScore,
          macroScore,
          macroScoreSource,
          macroEmotions,
          clinicalScore,
          averageEmotions,
          macroData: {
            ...macroResult,
            calculationDetails: macroResult.calculationDetails || null,
            recordCount: macroResult.recordCount || 24,
            timestamp: macroResult.timestamp || new Date().toISOString(),
            weightedAverages: macroResult.weightedAverages || null,
            emotions: macroResult.emotions || []
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

  // Determine color, level, and icon based on score
  const getDepressionLevel = (score) => {
    if (score < 0.30) return { 
      level: 'No Depression', 
      color: '#4caf50',
      icon: SentimentSatisfiedAltIcon,
      gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
      description: 'You are not showing signs of depression.'
    };
    if (score >= 0.30 && score <= 0.49) return { 
      level: 'Mild Depression', 
      color: '#8bc34a',
      icon: SentimentNeutralIcon,
      gradient: 'linear-gradient(135deg, #8bc34a 0%, #aed581 100%)',
      description: 'You are showing mild signs of depression. Monitor your mood.'
    };
    if (score >= 0.50 && score <= 0.69) return { 
      level: 'Moderate', 
      color: '#ff9800',
      icon: SentimentDissatisfiedIcon,
      gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      description: 'You are showing moderate signs of depression. Consider seeking support.'
    };
    if (score >= 0.70 && score <= 0.85) return { 
      level: 'Severe', 
      color: '#f44336',
      icon: SentimentVeryDissatisfiedIcon,
      gradient: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
      description: 'You are showing severe signs of depression. Please consult a healthcare professional.'
    };
    return { 
      level: 'Very Severe', 
      color: '#d32f2f',
      icon: SentimentVeryDissatisfiedIcon,
      gradient: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
      description: 'You are showing very severe signs of depression. Urgent professional help is recommended.'
    };
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading depression prediction data...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="error" variant="filled" sx={{ p: 2, borderRadius: 2, fontSize: '1rem' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // No data state
  if (!predictionData) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="info" variant="filled" sx={{ p: 2, borderRadius: 2, fontSize: '1rem' }}>
          No depression prediction data available
        </Alert>
      </Container>
    );
  }
  const { microScore, macroScore, clinicalScore, averageEmotions } = predictionData;

  // Bar Chart Configuration
  const barChartData = {
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
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: 'Score',
          font: { size: 14, weight: 'bold' }
        },
        ticks: {
          stepSize: 0.1,
          color: theme.palette.text.secondary
        },
        grid: {
          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Assessment Type',
          font: { size: 14, weight: 'bold' }
        },
        grid: { display: false }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        bodyColor: theme.palette.mode === 'dark' ? '#000' : '#fff'
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeOutCubic'
    }
  };  // Radar Chart Configuration
  const emotionLabels = ['Sadness', 'Anger', 'Fear', 'Neutral', 'Joy', 'Surprise'];
  
  // Prepare emotion data in consistent order matching emotionLabels
  const emotionValues = [
    averageEmotions.Sadness || 0,
    averageEmotions.Anger || 0,
    averageEmotions.Fear || 0,
    averageEmotions.Neutral || 0,
    averageEmotions.Joy || 0,
    averageEmotions.Surprise || 0
  ];
  
  // Create weight data for visualization
  const weightValues = [
    emotionWeights.Sadness,
    emotionWeights.Anger,
    emotionWeights.Fear,
    emotionWeights.Neutral,
    emotionWeights.Joy,
    emotionWeights.Surprise
  ];
  
  const radarData = {
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
  };

  const radarOptions = {
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif"
          },
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => {
            const emotion = context.label;
            const dataset = context.dataset;
            const value = dataset.data[context.dataIndex].toFixed(3);
            const label = dataset.label;
            
            if (label === 'Depression Contribution') {
              const weight = emotionWeights[emotion] || 0;
              return `${emotion}: ${value} (weight: ${weight})`;
            }
            return `${emotion}: ${value}`;
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: { color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' },
        grid: { color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' },
        suggestedMin: 0,
        suggestedMax: 1,
        pointLabels: {
          font: {
            size: 14,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold'
          },
          color: theme.palette.text.primary,
          centerPointLabels: true,
          padding: 25
        },
        ticks: {
          backdropColor: 'transparent',
          color: theme.palette.text.secondary,
          font: { size: 10 },
          showLabelBackdrop: false
        },
        beginAtZero: true,
        alignToPixels: true
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 20,
          font: { size: 14 },
          color: theme.palette.text.primary
        }
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        bodyColor: theme.palette.mode === 'dark' ? '#000' : '#fff'
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 1500,
      easing: 'easeOutCubic'
    }
  };

  // Indicator configurations with timestamps
  const indicators = [
    {
      level: 'Micro',
      timeWindow: '5 min',
      usedFor: 'Emotion detection per input session',
      score: microScore,
      description: 'Analyzes immediate emotional responses within a short time frame.',
      timestamp: new Date().toLocaleString()
    },
    {
      level: 'Macro',
      timeWindow: '24h average',
      usedFor: 'Daily depression estimation (Dt)',
      score: macroScore,
      description: 'Evaluates average emotional patterns over a day for consistent trends.',
      timestamp: new Date().toLocaleString()
    },
    {
      level: 'Clinical',
      timeWindow: '7-day trend',
      usedFor: 'Alerting and clinical summary',
      score: clinicalScore,
      description: 'Assesses long-term patterns to inform clinical decisions.',
      timestamp: new Date().toLocaleString()
    }
  ];

  // Animation variants
  const boxVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.8, 
        type: "spring", 
        stiffness: 100,
        damping: 10
      } 
    },
    hover: { 
      scale: 1.05, 
      y: -8,
      boxShadow: "0px 14px 28px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const chipVariants = {
    initial: { scale: 1 },
    highScore: {
      scale: [1, 1.15, 1],
      boxShadow: [
        '0 0 0px rgba(0, 0, 0, 0)',
        '0 0 22px rgba(255, 0, 0, 0.8)',
        '0 0 0px rgba(0, 0, 0, 0)'
      ],
      transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
    },
    severe: {
      scale: [1, 1.1, 1],
      boxShadow: [
        '0 0 0px rgba(0, 0, 0, 0)',
        '0 0 20px rgba(244, 67, 54, 0.8)',
        '0 0 0px rgba(0, 0, 0, 0)'
      ],
      transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
    }
  };

  const scoreNumberVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 120,
        delay: 0.4,
        duration: 0.8
      }
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: (score) => ({
      width: `${Math.min(score * 100, 100)}%`,
      transition: { duration: 1.5, ease: "easeOut" }
    })
  };

  const iconVariants = {
    hidden: { opacity: 0, rotate: -45, scale: 0.7 },
    visible: { 
      opacity: 1, 
      rotate: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: 0.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 200
      }
    },
    pulse: {
      scale: [1, 1.15, 1],
      filter: [
        'drop-shadow(0px 0px 0px rgba(0,0,0,0))',
        'drop-shadow(0px 0px 8px rgba(0,0,0,0.3))',
        'drop-shadow(0px 0px 0px rgba(0,0,0,0))'
      ],
      transition: { 
        repeat: Infinity,
        repeatType: "reverse", 
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Box sx={{ 
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          mb: 5,
          pb: 3,
          borderBottom: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          gap: { xs: 2, md: 4 }
        }}>
          <Box
            sx={{
              position: 'absolute',
              top: -30,
              right: -60,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0) 70%)',
              zIndex: 0
            }}
          />
          <Avatar
            sx={{
              width: 84,
              height: 84,
              bgcolor: theme.palette.primary.main,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 24px rgba(33, 150, 243, 0.2)'
                : '0 8px 24px rgba(33, 150, 243, 0.3)',
              zIndex: 1
            }}
          >
            <PsychologyIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h3" 
              component="h1"
              fontWeight={700}
              sx={{ 
                background: 'linear-gradient(90deg, #2196f3 0%, #4dabf5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}
            >
              Depression Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 600 }}>
              Comprehensive evaluation of your emotional well-being through micro, macro, and clinical assessments.
              Updated {predictionData.lastUpdated || 'recently'}.
            </Typography>
          </Box>
        </Box>
      </motion.div>
      {emailError && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error" variant="filled" sx={{ p: 2, borderRadius: 2, fontSize: '1rem' }}>
            {emailError}
          </Alert>
        </Box>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper 
          elevation={2}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(33, 150, 243, 0.02)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <InfoIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Depression Score Reference
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4} md={2.4}>
              <Box sx={{ 
                bgcolor: '#4caf5015', 
                p: 1.5, 
                borderRadius: 2,
                border: '1px solid #4caf5030',
                textAlign: 'center'
              }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#4caf50' }}>No Depression</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>0 to 0.30</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={2.4}>
              <Box sx={{ 
                bgcolor: '#8bc34a15', 
                p: 1.5, 
                borderRadius: 2,
                border: '1px solid #8bc34a30',
                textAlign: 'center'
              }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#8bc34a' }}>Mild Depression</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>0.30–0.49</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={2.4}>
              <Box sx={{ 
                bgcolor: '#ff980015', 
                p: 1.5, 
                borderRadius: 2,
                border: '1px solid #ff980030',
                textAlign: 'center'
              }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#ff9800' }}>Moderate</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>0.50–0.69</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ 
                bgcolor: '#f4433615', 
                p: 1.5, 
                borderRadius: 2,
                border: '1px solid #f4433630',
                textAlign: 'center'
              }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#f44336' }}>Severe</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>0.70–0.85</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>              <Box sx={{ 
                bgcolor: '#d32f2f15', 
                p: 1.5, 
                borderRadius: 2,
                border: '1px solid #d32f2f30',
                textAlign: 'center'
              }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#d32f2f' }}>Very Severe</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>0.85 to 1.0</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {indicators.map((indicator, index) => {
              const { level, color, icon: EmotionIcon, gradient, description: levelDescription } = getDepressionLevel(indicator.score);
              return (
                <Grid item xs={12} sm={4} key={indicator.level}>
                  <motion.div
                    variants={boxVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.2 }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 4,
                        pt: 5,
                        pb: 5,
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark' 
                          ? `linear-gradient(145deg, #2d2d2d 0%, #333333 100%)` 
                          : `linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)`,
                        boxShadow: `0 10px 30px ${color}40`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${color}40`,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          right: 0, 
                          height: '8px', 
                          background: gradient 
                        }} 
                      />
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          bottom: -30, 
                          right: -30, 
                          width: 140, 
                          height: 140, 
                          borderRadius: '50%', 
                          background: `${color}10`,
                          zIndex: 0
                        }} 
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <motion.div
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="pulse"
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: `${color}20`, 
                                color: color,
                                width: 52,
                                height: 52,
                                boxShadow: `0 6px 12px ${color}40`,
                                border: `2px solid ${color}60`
                              }}
                            >
                              <EmotionIcon fontSize="medium" />
                            </Avatar>
                          </motion.div>
                          <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                            {indicator.level} Score
                          </Typography>
                        </Box>
                        <MuiTooltip title={indicator.description}>
                          <InfoIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </MuiTooltip>
                      </Box>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          justifyContent: 'center',
                          my: 3,
                          px: 1,
                          py: 4,
                          borderRadius: 4,
                          width: '100%',
                          maxWidth: '100%',
                          overflow: 'visible',
                          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.03)',
                          border: `1px dashed ${color}30`,
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        <motion.div
                          variants={chipVariants}
                          initial="initial"
                          animate={
                            indicator.score > 0.85
                              ? 'highScore'
                              : level === 'Severe'
                              ? 'severe'
                              : 'initial'
                          }
                          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                        >
                          <Chip
                            label={level}
                            size="large"
                            sx={{
                              mb: 2.5,
                              px: 1.5,
                              py: 2.5,
                              height: 'auto',
                              width: 'auto',
                              maxWidth: '95%',
                              bgcolor: `${color}20`,
                              color,
                              fontWeight: 700,
                              fontSize: { xs: '1.2rem', sm: '1.6rem' },
                              borderRadius: 3,
                              boxShadow: indicator.score > 0.85 || level === 'Severe' ? `0 0 15px ${color}80` : 'none',
                              '& .MuiChip-label': { 
                                px: { xs: 1, sm: 2 },
                                py: 0.5,
                                whiteSpace: 'normal',
                                textAlign: 'center',
                                lineHeight: 1.2
                              }
                            }}
                          />
                        </motion.div>
                        <motion.div
                          variants={scoreNumberVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Typography 
                            variant="h6" 
                            fontWeight={500} 
                            sx={{ 
                              color, 
                              textAlign: 'center',
                              opacity: 0.9,
                              fontSize: '1.2rem'
                            }}
                          >
                            Score: {indicator.score.toFixed(2)}
                          </Typography>
                        </motion.div>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mt: 2, 
                            color: theme.palette.text.secondary,
                            textAlign: 'center',
                            fontStyle: 'italic',
                            maxWidth: '90%',
                            mx: 'auto'
                          }}
                        >
                          {levelDescription}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1, mb: 2, width: '100%', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 0.5 }}>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                            0.00
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                            1.00
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          width: '100%', 
                          height: '10px', 
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
                          borderRadius: 5,
                          overflow: 'hidden'
                        }}>
                          <motion.div
                            custom={indicator.score}
                            variants={progressVariants}
                            initial="initial"
                            animate="animate"
                            style={{ 
                              height: '100%', 
                              background: gradient,
                              borderRadius: 5
                            }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ 
                        mt: 'auto',
                        pt: 2, 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 0.5,
                        zIndex: 1
                      }}>
                        <Divider sx={{ width: '80%', mb: 1.5 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Updated: {indicator.timestamp || new Date().toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, opacity: 0.8 }}>
                          Time window: {indicator.timeWindow}
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3, 
                fontWeight: 700, 
                color: theme.palette.text.primary,
                textAlign: 'center',
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginTop:"100px",
                gap: 2,
                '&:before, &:after': {
                  content: '""',
                  flexGrow: 1,
                  height: 2,
                  maxWidth: { xs: 50, sm: 100 },
                  borderRadius: 2,
                  background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                  opacity: 0.6
                }
              }}
            >
              <br></br>
              <BarChartIcon sx={{ mr: 1, color: theme.palette.primary.main }}  />
              Visualization Analysis
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                textAlign: 'center', 
                mb: 5,
                maxWidth: 800,
                mx: 'auto'
              }}
            >
              These charts provide a comprehensive view of your emotional patterns and depression indicators over time
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.15)', transition: { duration: 0.3 } }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(145deg, #2c3e50 0%, #1e272e 100%)'
                        : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      height: '4px', 
                      background: 'linear-gradient(90deg, #2196f3, #4dabf5)' 
                    }}/>
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 15, 
                      right: 15, 
                      width: 120, 
                      height: 120, 
                      borderRadius: '50%', 
                      background: 'radial-gradient(circle, rgba(33, 150, 243, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
                      zIndex: 0
                    }}/>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, zIndex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Depression Score Analysis
                      </Typography>
                      <BarChartIcon color="primary" />
                    </Box>
                    <Box sx={{ height: 380, position: 'relative', zIndex: 1 }}>
                      <Bar ref={barChartRef} data={barChartData} options={barChartOptions} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic' }}>
                      Compare your micro, macro, and clinical depression scores to track changes over time
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                  whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.15)', transition: { duration: 0.3 } }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 4,
                      borderRadius: 3, 
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(145deg, #2c3e50 0%, #1e272e 100%)' 
                        : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: 'linear-gradient(to right, #9c27b0, #673ab7, #3f51b5)'
                      }} 
                    />
                    <Box sx={{ 
                      position: 'absolute', 
                      top: -40, 
                      left: -40, 
                      width: 140, 
                      height: 140, 
                      borderRadius: '50%', 
                      background: 'radial-gradient(circle, rgba(156, 39, 176, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
                      zIndex: 0
                    }}/>
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: -30, 
                      right: -30, 
                      width: 100, 
                      height: 100, 
                      borderRadius: '50%', 
                      background: 'radial-gradient(circle, rgba(63, 81, 181, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
                      zIndex: 0
                    }}/>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 3,
                      pb: 2,
                      borderBottom: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      zIndex: 1
                    }}>
                      <Typography variant="h6" fontWeight={600}>
                        Emotional Pattern Analysis
                      </Typography>
                      <BubbleChartIcon sx={{ color: '#9c27b0' }} />
                    </Box>
                    <Box sx={{ 
                      height: 380, 
                      position: 'relative', 
                      zIndex: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <Box sx={{ 
                        width: '95%', 
                        height: '100%', 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Radar ref={radarChartRef} data={radarData} options={radarOptions} />                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic', zIndex: 1 }}>
                      Distribution of your emotional patterns across different mood categories
                    </Typography>                    <Box sx={{ mt: 2, p: 2, border: '1px dashed rgba(0,0,0,0.1)', borderRadius: 2, background: 'rgba(0,0,0,0.02)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, display: 'flex', alignItems: 'center' }}>
                          <InfoIcon sx={{ fontSize: '14px', color: theme.palette.primary.main, mr: 0.5 }} />
                          Depression Score Calculation Debug Panel
                        </Typography>
                        <Chip 
                          size="small" 
                          label="Diagnostic" 
                          variant="outlined" 
                          color="primary" 
                          sx={{ height: 20, fontSize: '10px' }}
                        />
                      </Box>
                      <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: '10px' }}>{/* Header with clear explanation */}                        
                        <div style={{ 
                          backgroundColor: '#e3f2fd', 
                          padding: '8px', 
                          borderRadius: '4px', 
                          marginBottom: '10px',
                          border: '1px solid #90caf9'
                        }}>
                          <div style={{ fontWeight: 'bold', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Depression Score Calculation Framework</span>
                            <span style={{ fontSize: '9px', backgroundColor: '#2196f3', color: 'white', padding: '1px 5px', borderRadius: '10px' }}>
                              Clinical Algorithm
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5px', fontSize: '9px', marginTop: '5px' }}>
                            <div style={{ fontWeight: 'bold', color: '#2196f3' }}>Micro Score (5-min):</div>
                            <div>Current emotional state from latest session data</div>
                              <div style={{ fontWeight: 'bold', color: '#ff9800' }}>Macro Score (Last 24 Hours):</div>
                            <div>Aggregated from hourly emotion records over the past 24 hours from current time</div>
                            
                            <div style={{ fontWeight: 'bold', color: '#f44336' }}>Clinical Score:</div>
                            <div>Comprehensive assessment from historical data</div>
                          </div>
                            <div style={{ marginTop: '8px', fontStyle: 'italic', fontSize: '8px', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '4px', borderRadius: '3px' }}>
                            All scores use the clinical algorithm: weighted emotions → raw score → shifted score (+1.3) → normalized score (/3.6)
                            <div style={{ marginTop: '3px', fontWeight: 'bold' }}>
                              Note: Macro score uses data from exactly the past 24 hours from current time
                            </div>
                          </div>
                          
                          <div style={{ 
                            marginTop: '5px', 
                            fontSize: '8px', 
                            borderTop: '1px dashed #90caf9', 
                            paddingTop: '5px',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <div>
                              <span style={{ fontWeight: 'bold' }}>Data Sources:</span>                            <span> 5-min API: http://localhost:4000/api/average/combined-5min-weighted-average</span>
                              <span> | 24hr API: http://localhost:4000/api/average/60min-weighted-average (past 24 hrs from now)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ fontSize: '10px', mr: 0.5, color: '#2196f3' }} />
                              <span>{new Date().toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Micro Score with blue theme */}
                        <div style={{ 
                          backgroundColor: 'rgba(33, 150, 243, 0.05)', 
                          padding: '8px', 
                          borderRadius: '4px',
                          border: '1px solid rgba(33, 150, 243, 0.2)'
                        }}>                          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#2196f3', borderBottom: '1px dotted #2196f3', paddingBottom: '2px' }}>
                            MICRO SCORE CALCULATION (5-min data)
                          </div>                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ fontWeight: 'bold' }}>Value:</div> 
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <div style={{ 
                                fontWeight: 'bold',
                                color: '#ffffff', 
                                backgroundColor: '#2196f3',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '10px'
                              }}>
                                {microScore?.toFixed(3) || 'Not available'}
                              </div>
                              <div style={{ 
                                fontSize: '8px',
                                color: getDepressionLevel(microScore).color,
                                fontWeight: 'bold' 
                              }}>
                                {getDepressionLevel(microScore).level}
                              </div>
                            </div>
                          </div>
                          <div style={{ marginBottom: '8px' }}>Step 1-2: Emotion Values × Clinical Weights</div>
                          {Object.entries(averageEmotions).map(([emotion, value]) => (
                            <div key={emotion}>
                              {emotion}: {value?.toFixed(3) || 0} × {emotionWeights[emotion] || 0} = {((value || 0) * (emotionWeights[emotion] || 0)).toFixed(3)}
                            </div>
                          ))}
                          
                          <div style={{ marginTop: '8px', borderTop: '1px dotted #ccc', paddingTop: '5px' }}>
                            Step 3: Raw Score (sum of weighted emotions): {Object.entries(averageEmotions).reduce((sum, [emotion, value]) => 
                              sum + ((emotionWeights[emotion] || 0) * (value || 0)), 0).toFixed(3)}
                          </div>
                          <div>
                            Step 4: Shifted Score (raw + 1.3): {(Object.entries(averageEmotions).reduce((sum, [emotion, value]) => 
                              sum + ((emotionWeights[emotion] || 0) * (value || 0)), 0) + 1.3).toFixed(3)}
                          </div>                          <div style={{ fontWeight: 'bold', color: '#2196f3' }}>
                            Step 5: Final Micro Score ((raw + 1.3) / 3.6): {((Object.entries(averageEmotions).reduce((sum, [emotion, value]) => 
                              sum + ((emotionWeights[emotion] || 0) * (value || 0)), 0) + 1.3) / 3.6).toFixed(3)}
                          </div>
                          
                          <div style={{ fontSize: '8px', marginTop: '5px', textAlign: 'right', fontStyle: 'italic', color: '#2196f3' }}>
                            Timestamp: {new Date().toLocaleString()}
                          </div>
                          
                          {/* Data Information Status */}
                          <div style={{ marginTop: '8px', padding: '4px', fontSize: '8px', backgroundColor: '#f5f5f5', borderRadius: '2px' }}>
                            <span style={{ fontWeight: 'bold' }}>Data Sources:</span> 
                            <span> Micro: {predictionData?.dataSource || 'unknown'} | </span>
                            <span>Macro: {predictionData?.macroScoreSource || 'unknown'} | </span>
                            <span>Last Updated: {predictionData?.lastUpdated || new Date().toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {/* Other scores with their own themes */}
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>                          {/* Macro Score */}                          <div style={{ 
                            flex: '1', 
                            backgroundColor: 'rgba(255, 152, 0, 0.05)', 
                            padding: '8px', 
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 152, 0, 0.2)'
                          }}>                            <div style={{ fontWeight: 'bold', color: '#ff9800', borderBottom: '1px dotted #ff9800', paddingBottom: '2px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>MACRO SCORE (Last 24 Hours)</div>
                              <div style={{ fontSize: '7px', fontWeight: 'normal', backgroundColor: '#fff3e0', padding: '1px 4px', borderRadius: '3px' }}>
                                Hourly records from last 24 hrs
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <div style={{ fontWeight: 'bold' }}>Value:</div> 
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ 
                                  fontWeight: 'bold',
                                  color: '#ffffff', 
                                  backgroundColor: '#ff9800',
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  fontSize: '10px'
                                }}>
                                  {macroScore?.toFixed(3) || 'Not available'}
                                </div>
                                <div style={{ 
                                  fontSize: '8px',
                                  color: getDepressionLevel(macroScore).color,
                                  fontWeight: 'bold' 
                                }}>
                                  {getDepressionLevel(macroScore).level}
                                </div>
                              </div>
                            </div>
                            
                            {/* Improved macro score calculation visualization */}
                            {predictionData?.macroEmotions ? (
                              <>
                                <div style={{ fontSize: '8px', marginTop: '8px', borderTop: '1px dotted #ccc', paddingTop: '5px' }}>                                  <div style={{ marginBottom: '3px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Step 1-2: Last 24 Hours Emotion Values & Clinical Weights</span>
                                    <span style={{ color: '#ff9800', fontSize: '7px' }}>From 60-min API, aligned with current time</span>
                                  </div>
                                  
                                  {/* Emotion weights table with visual indicators */}
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '2px', marginBottom: '5px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '7px', borderBottom: '1px solid #ffe0b2' }}>Emotion</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '7px', borderBottom: '1px solid #ffe0b2' }}>Value</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '7px', borderBottom: '1px solid #ffe0b2' }}>Weight</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '7px', borderBottom: '1px solid #ffe0b2' }}>Contribution</div>
                                    
                                    {Object.entries(predictionData.macroEmotions).map(([emotion, value]) => {
                                      const weight = emotionWeights[emotion] || 0;
                                      const contribution = (value || 0) * weight;
                                      const isPositive = contribution >= 0;
                                      
                                      return (
                                        <React.Fragment key={emotion}>
                                          <div style={{ fontSize: '7px' }}>{emotion}</div>
                                          <div style={{ fontSize: '7px' }}>
                                            <span style={{ 
                                              display: 'inline-block',
                                              width: `${Math.min(value * 100, 100)}%`, 
                                              height: '3px', 
                                              backgroundColor: emotion === 'Joy' ? '#4caf50' : 
                                                              emotion === 'Sadness' ? '#42a5f5' : 
                                                              emotion === 'Anger' ? '#f44336' : 
                                                              emotion === 'Fear' ? '#7e57c2' : 
                                                              emotion === 'Surprise' ? '#ffca28' : '#9e9e9e',
                                              marginRight: '3px'
                                            }}></span>
                                            {(value || 0).toFixed(3)}
                                          </div>
                                          <div style={{ fontSize: '7px' }}>
                                            <span style={{
                                              color: weight > 0 ? '#f44336' : weight < 0 ? '#4caf50' : '#9e9e9e',
                                              fontWeight: Math.abs(weight) > 0.5 ? 'bold' : 'normal'
                                            }}>
                                              {weight.toFixed(1)}
                                            </span>
                                          </div>
                                          <div style={{ fontSize: '7px' }}>
                                            <span style={{
                                              color: isPositive ? '#f44336' : '#4caf50',
                                              fontWeight: Math.abs(contribution) > 0.1 ? 'bold' : 'normal'
                                            }}>
                                              {contribution.toFixed(3)}
                                            </span>
                                            <span style={{ 
                                              display: 'inline-block',
                                              width: `${Math.min(Math.abs(contribution) * 100, 100)}%`, 
                                              height: '3px', 
                                              backgroundColor: isPositive ? '#f44336' : '#4caf50',
                                              marginLeft: '3px'
                                            }}></span>
                                          </div>
                                        </React.Fragment>
                                      );
                                    })}
                                  </div>
                                </div>
                                
                                <div style={{ fontSize: '8px', marginTop: '5px', borderTop: '1px dotted #ccc', paddingTop: '5px' }}>
                                  {/* Calculate the raw score using the same algorithm as micro score */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                    <span>Step 3: Raw Score (sum of weighted emotions):</span>
                                    <span style={{ fontWeight: 'bold' }}>
                                      {Object.entries(predictionData.macroEmotions).reduce((sum, [emotion, value]) => 
                                        sum + ((emotionWeights[emotion] || 0) * (value || 0)), 0).toFixed(3)}
                                    </span>
                                  </div>
                                  
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                    <span>Step 4: Shifted Score (raw + 1.3):</span>
                                    <span style={{ fontWeight: 'bold' }}>
                                      {(Object.entries(predictionData.macroEmotions).reduce((sum, [emotion, value]) => 
                                        sum + ((emotionWeights[emotion] || 0) * (value || 0)), 0) + 1.3).toFixed(3)}
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#ff9800', borderTop: '1px solid #ffe0b2', paddingTop: '3px', marginTop: '3px' }}>
                                    <span>Step 5: Final Macro Score ((raw + 1.3) / 3.6):</span>
                                    <span>
                                      {((Object.entries(predictionData.macroEmotions).reduce((sum, [emotion, value]) => 
                                        sum + ((emotionWeights[emotion] || 0) * (value || 0)), 0) + 1.3) / 3.6).toFixed(3)}
                                    </span>
                                  </div>
                                  
                                  <div style={{ fontSize: '7px', marginTop: '5px', textAlign: 'right', fontStyle: 'italic', color: '#ff9800' }}>
                                    {predictionData?.macroData?.timestamp ? 
                                      `Timestamp: ${new Date(predictionData.macroData.timestamp).toLocaleString()}` :
                                      `Timestamp: ${new Date().toLocaleString()}`}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div style={{ fontSize: '8px', marginTop: '8px', fontStyle: 'italic', padding: '4px', backgroundColor: '#fffde7', borderRadius: '3px' }}>
                                <div>No emotion details available for macro score calculation.</div>
                                <div>Score was retrieved directly from the API.</div>
                                {predictionData?.macroScoreSource && (
                                  <div style={{ marginTop: '3px', fontWeight: 'bold' }}>
                                    Source: {predictionData.macroScoreSource}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* API Calculation Details */}
                            {predictionData?.macroData?.calculationDetails && (
                              <div style={{ 
                                fontSize: '8px', 
                                marginTop: '5px',
                                borderTop: '1px dotted #ccc',
                                paddingTop: '5px',
                                backgroundColor: 'rgba(255, 248, 225, 0.5)',
                                padding: '4px',
                                borderRadius: '3px'
                              }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>API Calculation Details:</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                                  <div>Raw Score from API:</div>
                                  <div style={{ fontWeight: 'bold' }}>{predictionData.macroData.calculationDetails.rawScore?.toFixed(3) || 'N/A'}</div>
                                  
                                  <div>Shifted Score (+1.3):</div>
                                  <div style={{ fontWeight: 'bold' }}>{predictionData.macroData.calculationDetails.shiftedScore?.toFixed(3) || 'N/A'}</div>
                                  
                                  <div>Normalized Score (/3.6):</div>
                                  <div style={{ fontWeight: 'bold', color: '#ff9800' }}>{predictionData.macroData.calculationDetails.normalizedScore?.toFixed(3) || 'N/A'}</div>
                                </div>
                              </div>
                            )}
                            
                            <div style={{ 
                              fontSize: '7px', 
                              marginTop: '8px', 
                              backgroundColor: '#fff3e0',
                              padding: '4px',
                              borderRadius: '3px',
                              border: '1px dashed #ffcc80'
                            }}>                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>                                <div style={{ fontWeight: 'bold' }}>
                                  ⓘ Data source: {predictionData?.macroScoreSource || 'unknown'}
                                </div>
                                <div style={{ 
                                  fontSize: '6px',
                                  backgroundColor: '#ff9800',
                                  color: 'white',
                                  padding: '1px 4px',
                                  borderRadius: '8px'
                                }}>
                                  LAST 24 HRS DATA
                                </div>
                              </div>
                              <div style={{ marginTop: '2px' }}>
                                Data analyzed: Hourly emotion records from the past 24 hours
                                {predictionData?.macroData?.emotions && ` (${predictionData.macroData.emotions.length} available)`}
                              </div>
                              
                              <div style={{ marginTop: '2px', fontStyle: 'italic' }}>
                                Time range: Last 24 hours from {predictionData?.macroData?.timestamp ? 
                                  new Date(predictionData.macroData.timestamp).toLocaleString() : 
                                  new Date().toLocaleString()} (current time)
                              </div>
                            </div>
                          </div>
                            {/* Clinical Score */}
                          <div style={{ 
                            flex: '1', 
                            backgroundColor: 'rgba(244, 67, 54, 0.05)', 
                            padding: '8px', 
                            borderRadius: '4px', 
                            border: '1px solid rgba(244, 67, 54, 0.2)'
                          }}>                            <div style={{ fontWeight: 'bold', color: '#f44336', borderBottom: '1px dotted #f44336', paddingBottom: '2px', marginBottom: '5px' }}>
                              CLINICAL SCORE (Overall)
                            </div>                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <div style={{ fontWeight: 'bold' }}>Value:</div> 
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ 
                                  fontWeight: 'bold',
                                  color: '#ffffff', 
                                  backgroundColor: '#f44336',
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  fontSize: '10px'
                                }}>
                                  {clinicalScore?.toFixed(3) || 'Not available'}
                                </div>
                                <div style={{ 
                                  fontSize: '8px',
                                  color: getDepressionLevel(clinicalScore).color,
                                  fontWeight: 'bold' 
                                }}>
                                  {getDepressionLevel(clinicalScore).level}
                                </div>
                              </div>
                            </div>
                            
                            <div style={{ fontSize: '8px', marginTop: '5px', textAlign: 'right', fontStyle: 'italic', color: '#f44336' }}>
                              Timestamp: {predictionData?.lastUpdated || new Date().toLocaleString()}
                            </div>
                            
                            <div style={{ fontSize: '8px', marginTop: '8px', fontStyle: 'italic', backgroundColor: '#ffebee', padding: '4px', borderRadius: '3px' }}>
                              <div style={{ fontWeight: 'bold' }}>
                                ⓘ Clinical score represents a comprehensive assessment
                              </div>
                              <div>
                                Based on long-term historical data and weighted across multiple modalities
                              </div>
                              <div>
                                Last updated: {predictionData?.lastUpdated || new Date().toLocaleString()}
                              </div>
                            </div>
                            <div style={{ fontSize: '8px', marginTop: '5px', fontStyle: 'italic' }}>
                              ⓘ From API directly
                            </div>
                          </div>
                        </div>
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Grid>  
      </Grid>
    </Container>
  );
};

export default DepressionPredictions;