
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

// Simplified function that just returns dummy data for depression score
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

// Format data for charts - simplified version
export const formatChartData = (emotionData, theme) => {
  // Generate dummy emotion data for visualization
  const emotionLabels = ['Sadness', 'Anger', 'Fear', 'Neutral', 'Joy', 'Surprise'];
  const emotionValues = [
    Math.random() * 0.1,
    Math.random() * 0.4,
    Math.random() * 0.3,
    Math.random() * 0.7,
    Math.random() * 0.6,
    Math.random() * 0.
  ];
  
  console.log("Using dummy emotion values for chart:", emotionValues);
  
  // Return formatted chart data - simplified with only one dataset
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

// Custom hook for depression data using dummy data
export const useDepressionPredictions = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailError, setEmailError] = useState(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('D7VczC01i0Q9NyruI');
  }, []);

  // Function to send email alert (only keeping this functionality)
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
  
  // Generate dummy depression data
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(true);
      try {
        console.log("Generating dummy depression data");
        
        // Generate dummy scores
        const microScore = calculateDepressionScore();
        const macroScore = calculateDepressionScore();
        const clinicalScore = calculateDepressionScore();
        
        // Create dummy emotion data
        const dummyEmotions = {
          Sadness: Math.random() * 0.6,
          Anger: Math.random() * 0.4,
          Fear: Math.random() * 0.3,
          Neutral: Math.random() * 0.5,
          Joy: Math.random() * 0.7,
          Surprise: Math.random() * 0.4
        };
        
        // Consolidate data
        const data = {
          microScore,
          macroScore,
          clinicalScore,
          averageEmotions: dummyEmotions,
          lastUpdated: new Date().toLocaleString()
        };
        
        console.log("Dummy depression data:", data);
        setPredictionData(data);
        
        // Send email alerts for scores above 0.50
        if (microScore > 0.50) sendAlertEmail('Micro', microScore);
        if (macroScore > 0.50) sendAlertEmail('Macro', macroScore);
        if (clinicalScore > 0.50) sendAlertEmail('Clinical', clinicalScore);
        
      } catch (err) {
        console.error('Error generating dummy data:', err);
        setError('Failed to generate depression data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }, 1000); // 1 second delay to simulate loading
    
    return () => clearTimeout(timer);
  }, []);
  return { predictionData, error, loading, emailError, getDepressionLevel };
};
