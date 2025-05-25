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
  };

  // Fetch data and check for high scores
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/average/combined-5min-weighted-average');
        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          const data = {
            ...result,
            microScore: 0.5, // Mock data
            macroScore: result.averageDepressionScore || 0.45,
            clinicalScore: 0.2, // Set to trigger email alert
            averageEmotions: {
              Anger: 0.2,
              Fear: 0.3,
              Happy: 0.5,
              Neutral: 0.6,
              Sad: 0.4,
              Surprise: 0.1
            }
          };
          setPredictionData(data);

          // Check for high scores and send email alerts
          if (data.microScore > 0.85) await sendAlertEmail('Micro', data.microScore);
          if (data.macroScore > 0.85) await sendAlertEmail('Macro', data.macroScore);
          if (data.clinicalScore > 0.85) await sendAlertEmail('Clinical', data.clinicalScore);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch depression prediction data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);  // Determine color, level and icon based on score (Dt Range)
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
    labels: ['Micro Score', 'Macro Score', 'Clinical Score'],
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
        },        ticks: {
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
  };

  // Radar Chart Configuration
  const radarData = {
    labels: ['Anger', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
    datasets: [
      {
        label: 'Average Emotions',
        data: [
          averageEmotions.Anger,
          averageEmotions.Fear,
          averageEmotions.Happy,
          averageEmotions.Neutral,
          averageEmotions.Sad,
          averageEmotions.Surprise
        ],
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
  };  const radarOptions = {
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    scales: {
      r: {
        angleLines: { color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' },
        grid: { color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' },
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
  
  // Enhanced number animations with counting up effect
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
  
  // Enhanced icon animations with more dynamic effects
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
    }  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Enhanced Header with decorative elements */}
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
          {/* Decorative circle */}
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
      </motion.div>      {/* Email Error Alert */}
      {emailError && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error" variant="filled" sx={{ p: 2, borderRadius: 2, fontSize: '1rem' }}>
            {emailError}
          </Alert>
        </Box>
      )}
      
      {/* Depression Level Reference Chart */}
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
                <Typography variant="caption" sx={{ opacity: 0.8 }}>0 &lt; 0.30</Typography>
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
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ 
                bgcolor: '#d32f2f15', 
                p: 1.5, 
                borderRadius: 2,
                border: '1px solid #d32f2f30',
                textAlign: 'center'
              }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#d32f2f' }}>Very Severe</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>1.0&gt; 0.85</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Grid container spacing={3}>        {/* Depression Scores Row */}
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
                      {/* Decorative top gradient */}
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
                      
                      {/* Decorative circle in background */}
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
                      
                      {/* Main score display - made larger with enhanced styling */}                      <Box 
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
                        {/* Status first (above) */}
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
                        >                          <Chip
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
                        
                        {/* Score below status (smaller) */}
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
                      
                      {/* Add visual progress bar */}
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
                        {/* Timestamp */}
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
        </Grid>        {/* Enhanced Charts Row */}
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
              {/* Bar Chart - Enhanced */}
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
                    {/* Decorative elements */}
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

              {/* Radar Chart - Enhanced */}
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
                    {/* Decorative elements */}
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
                    
                    {/* Decorative circles */}
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
                    </Box>                      <Box sx={{ 
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
                        <Radar ref={radarChartRef} data={radarData} options={radarOptions} />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic', zIndex: 1 }}>
                      Distribution of your emotional patterns across different mood categories
                    </Typography>
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