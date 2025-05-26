
import React, { useRef, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Grid, Paper, Chip, Divider, FormControl, InputLabel, Select, MenuItem, Collapse, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Bar, Radar, Line } from 'react-chartjs-2';
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

// Import icons
import BarChartIcon from '@mui/icons-material/BarChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Import logic
import { formatChartData, formatTrendChartData } from './DepressionPredictionsLogic';

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

// Animation variants for depression level text
const depressionLevelVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut"
    }
  },
  severe: {
    scale: [1, 1.05, 1],
    textShadow: [
      '1px 1px 3px rgba(0,0,0,0.3)',
      '1px 1px 15px rgba(255,255,255,0.5)',
      '1px 1px 3px rgba(0,0,0,0.3)'
    ],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
  }
};

// Animation variants for expand more icon
const expandIconVariants = {
  collapsed: { rotate: 0 },
  expanded: { rotate: 180 }
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

const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'SentimentSatisfiedAlt': return SentimentSatisfiedAltIcon;
    case 'SentimentNeutral': return SentimentNeutralIcon;
    case 'SentimentDissatisfied': return SentimentDissatisfiedIcon;
    case 'SentimentVeryDissatisfied': return SentimentVeryDissatisfiedIcon;
    default: return SentimentNeutralIcon;
  }
};

const DepressionPredictionsUI = ({ 
  loading, 
  error, 
  emailError, 
  predictionData, 
  getDepressionLevel 
}) => {
  const theme = useTheme();
  const barChartRef = useRef(null);
  const radarChartRef = useRef(null);
  
  // State for emotion type selection
  const [emotionType, setEmotionType] = useState('micro');
  
  // State for tracking which dropdown is expanded
  const [expandedCard, setExpandedCard] = useState({
    Micro: false,
    Macro: false,
    Clinical: false
  });

  // Toggle expansion function
  const handleExpandClick = (level) => {
    setExpandedCard(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };
  
  // Score explanation content
  const scoreExplanations = {
    Micro: {
      title: "About Micro Score",
      description: "The Micro Score analyzes your immediate emotional state based on the last 5 minutes of data. It uses a weighted algorithm that processes the following emotions:",
      formula: "Score = (weighted_sum + shift_factor) / normalization_range",
      weights: [
        { emotion: "Sadness", weight: "1.0", impact: "Strong depression signal" },
        { emotion: "Anger", weight: "0.7", impact: "Common in depression" },
        { emotion: "Fear", weight: "0.6", impact: "Anxiety-related" },
        { emotion: "Neutral", weight: "0.0", impact: "No impact" }, 
        { emotion: "Joy", weight: "-1.0", impact: "Opposite of depression" },
        { emotion: "Surprise", weight: "-0.3", impact: "Mildly counter-depressive" }
      ],
      interpretation: "Higher scores indicate more depressive emotional patterns in your immediate state."
    },
    Macro: {
      title: "About Macro Score",
      description: "The Macro Score evaluates emotional patterns over the past 24 hours. It averages multiple micro scores to detect sustained emotional states using the same weighted algorithm:",
      formula: "Score = Average of multiple micro scores over 24 hours",
      weights: [
        { emotion: "Sadness", weight: "1.0", impact: "Strong depression signal" },
        { emotion: "Anger", weight: "0.7", impact: "Common in depression" },
        { emotion: "Fear", weight: "0.6", impact: "Anxiety-related" },
        { emotion: "Neutral", weight: "0.0", impact: "No impact" }, 
        { emotion: "Joy", weight: "-1.0", impact: "Opposite of depression" },
        { emotion: "Surprise", weight: "-0.3", impact: "Mildly counter-depressive" }
      ],
      interpretation: "Higher scores sustained over 24 hours may indicate more concerning depressive patterns."
    },
    Clinical: {
      title: "About Clinical Score",
      description: "The Clinical Score assesses long-term emotional trends over a 7-day period, placing greater weight on recent days and persistent negative emotions:",
      formula: "Score = Weighted average of macro scores with time decay factor",
      weights: [
        { emotion: "Sadness", weight: "1.0", impact: "Strong depression signal" },
        { emotion: "Anger", weight: "0.7", impact: "Common in depression" },
        { emotion: "Fear", weight: "0.6", impact: "Anxiety-related" },
        { emotion: "Neutral", weight: "0.0", impact: "No impact" }, 
        { emotion: "Joy", weight: "-1.0", impact: "Opposite of depression" },
        { emotion: "Surprise", weight: "-0.3", impact: "Mildly counter-depressive" }
      ],
      interpretation: "This score is designed to align with clinical assessments of depression and may trigger alerts for healthcare providers."
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '70vh' 
      }}>
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
  }  const { microScore, macroScore, clinicalScore, microEmotions, macroEmotions, clinicalEmotions, averageEmotions, trendData } = predictionData;
  
  // Select emotion data based on dropdown selection
  const selectedEmotionData = emotionType === 'clinical' ? (clinicalEmotions || averageEmotions) : 
                              emotionType === 'macro' ? (macroEmotions || averageEmotions) : 
                              (microEmotions || averageEmotions);
  
  // Format chart data
  const charts = formatChartData(selectedEmotionData, theme, emotionType);
  const barChartData = charts.bar.data(microScore, macroScore, clinicalScore);
  const radarData = charts.radar.data;  // Chart options (updated)
  const barChartOptions = {
    animation: false,
    maintainAspectRatio: true,
    responsive: true,
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
    },    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        bodyColor: theme.palette.mode === 'dark' ? '#000' : '#fff'
      }
    }
  };

  const radarOptions = {
    maintainAspectRatio: true,
    responsive: true,
    animation: {
      duration: 1500,
      easing: 'easeOutCubic'
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
          color: theme.palette.text.primary
        },
        ticks: {
          backdropColor: 'transparent',
          color: theme.palette.text.secondary,
          font: { size: 10 }
        },
        beginAtZero: true
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
    }
  };
  // Prepare indicator data
  const indicators = [
    {
      level: 'Micro',
      timeWindow: '5 min',
      usedFor: 'Emotion detection',
      score: microScore,
      description: 'Analyzes immediate emotional responses based on current data.',
      timestamp: predictionData.lastUpdated
    },
    {
      level: 'Macro',
      timeWindow: '24h average',
      usedFor: 'Daily depression estimation',
      score: macroScore,
      description: 'Evaluates average emotional patterns observed over the past 24 hours.',
      timestamp: predictionData.lastUpdated
    },
    {      level: 'Clinical',
      timeWindow: '7-day trend',
      usedFor: 'Alerting and clinical summary',
      score: clinicalScore,
      description: 'Assesses long-term emotional patterns for clinical analysis and decisions.',
      timestamp: predictionData.lastUpdated
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ 
          visible: { 
            transition: { 
              staggerChildren: 0.2,
              delayChildren: 0.1
            } 
          } 
        }}
      >        {/* Page Title - Enhanced with colors and animations */}
        <motion.div 
          variants={boxVariants}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            duration: 1.2, 
            bounce: 0.4 
          }}
        >          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', 
              p: 4, 
              borderRadius: 4,
              boxShadow: '0 10px 25px rgba(42, 117, 252, 0.3)',
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
              width: '80%',
              mx: 'auto' /* Centers the box horizontally */
            }}
          >            {/* Animated background elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.07, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'white',
                zIndex: 0
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.05, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{
                position: 'absolute',
                bottom: '-15%',
                left: '10%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'white',
                zIndex: 0
              }}
            />
            <motion.div
              animate={{ 
                x: [0, 10, 0, -10, 0], 
                y: [0, -10, 0, 10, 0],
                opacity: [0.04, 0.06, 0.04]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 8,
                ease: "easeInOut" 
              }}
              style={{
                position: 'absolute',
                top: '20%',
                left: '25%',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'white',
                zIndex: 0
              }}
            />
            <motion.div
              animate={{ 
                x: [0, -15, 0, 15, 0], 
                y: [0, 10, 0, -10, 0],
                opacity: [0.03, 0.05, 0.03]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 10,
                ease: "easeInOut" 
              }}
              style={{
                position: 'absolute',
                bottom: '30%',
                right: '20%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'white',
                zIndex: 0
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    align="center" 
                    gutterBottom 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 700,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                      letterSpacing: '0.5px',
                      position: 'relative',
                      textAlign: 'center',
                      '&::after': {
                        content: '""',
                        display: 'block',
                        width: '100px',
                        height: '4px',
                        background: 'rgba(255,255,255,0.7)',
                        borderRadius: '2px',
                        margin: '8px auto 0',
                      }
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      style={{ display: 'inline-block' }}
                    >
                      Depression
                    </motion.span>{' '}
                    <motion.span
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      style={{ 
                        display: 'inline-block',
                        background: 'linear-gradient(90deg, #ffffff, #a2d2ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      Prediction
                    </motion.span>
                  </Typography>
                  
                  {/* Decorative elements */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: '15%',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'white'
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    style={{
                      position: 'absolute',
                      top: '30%',
                      left: '20%',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'white'
                    }}
                  />
                </Box>
              </motion.div>
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Box sx={{ 
                  position: 'relative',
                  mt: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60px' }}
                    transition={{ delay: 1, duration: 0.6 }}
                    style={{
                      height: '1px',
                      background: 'rgba(255,255,255,0.5)',
                      marginRight: '15px'
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    align="center" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      maxWidth: '800px',
                      mx: 'auto',
                      lineHeight: 1.6,
                      fontWeight: 300,
                      letterSpacing: '0.5px',
                      textTransform: 'none',
                      px: 2
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        delay: 0.7, 
                        duration: 0.3,
                        staggerChildren: 0.08 
                      }}
                    >
                      Analysis based on emotional indicators from text, voice, and facial expressions
                    </motion.span>
                  </Typography>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60px' }}
                    transition={{ delay: 1, duration: 0.6 }}
                    style={{
                      height: '1px',
                      background: 'rgba(255,255,255,0.5)',
                      marginLeft: '15px'
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </Box>
        </motion.div>{/* Score Cards */}
        <motion.div style={{ width: '100%' }}>
          <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
            {indicators.map((indicator, index) => {
              const depressionInfo = getDepressionLevel(indicator.score);
              const IconComponent = getIconComponent(depressionInfo.icon);
              const explanation = scoreExplanations[indicator.level];
            
            return (
              <Grid item xs={12} md={4} key={indicator.level}>
                <motion.div variants={boxVariants} whileHover="hover" style={{ height: '100%' }}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      minHeight: expandedCard[indicator.level] ? '540px' : '320px', // Adjusted height
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      backgroundImage: depressionInfo.gradient,
                      color: '#fff',
                      overflow: 'hidden',
                      transition: 'min-height 0.3s ease-in-out' // Smooth transition for height change
                    }}
                  >                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="h2">
                        {indicator.level} Score
                      </Typography>
                      <motion.div variants={iconVariants} animate="visible" whileHover="pulse">
                        <IconComponent fontSize="large" />
                      </motion.div>
                    </Box>                    {/* Depression Level - Now featured prominently above the score */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <motion.div
                        initial="initial"
                        animate={indicator.score > 0.7 ? 'severe' : 'animate'}
                        variants={depressionLevelVariants}
                      >
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 'bold',
                            textAlign: 'center',
                            textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {depressionInfo.level}
                        </Typography>
                      </motion.div>
                    </Box>
                    
                    {/* Visual separator */}
                    <Box 
                      sx={{ 
                        width: '40%', 
                        height: '2px', 
                        background: 'rgba(255,255,255,0.4)', 
                        mx: 'auto', 
                        mb: 2,
                        borderRadius: '1px',
                      }} 
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, flexGrow: 0 }}>
                      <motion.div variants={scoreNumberVariants}>
                        <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', opacity: 0.8 }}>
                          Score: {indicator.score.toFixed(2)}
                        </Typography>
                      </motion.div>
                    </Box>
                      <Box 
                      sx={{ 
                        my: 2, 
                        height: 10, 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        borderRadius: 5,
                        width: '90%',
                        mx: 'auto'
                      }}
                    >
                      <motion.div
                        initial="initial"
                        animate="animate"
                        variants={progressVariants}
                        custom={indicator.score}
                        style={{
                          height: '100%',
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          borderRadius: 5
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
                        {depressionInfo.description}
                      </Typography>
                    </Box>
                    
                    {/* Dropdown Trigger Button */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center', 
                        cursor: 'pointer',
                        p: 1,
                        borderRadius: 1,
                        my: 1,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.25)',
                        }
                      }}
                      onClick={() => handleExpandClick(indicator.level)}
                    >
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="button">
                        {expandedCard[indicator.level] ? 'Hide Details' : 'How This Score Works'}
                      </Typography>
                      <motion.div
                        animate={expandedCard[indicator.level] ? 'expanded' : 'collapsed'}
                        variants={expandIconVariants}
                        transition={{ duration: 0.3 }}
                      >
                        <ExpandMoreIcon fontSize="small" sx={{ ml: 1 }} />
                      </motion.div>
                    </Box>
                    
                    {/* Dropdown Content */}
                    <Collapse in={expandedCard[indicator.level]} timeout="auto" unmountOnExit>
                      <Box 
                        sx={{ 
                          py: 2, 
                          px: 1.5, 
                          mt: 1, 
                          mb: 2,
                          bgcolor: 'rgba(0,0,0,0.15)', 
                          borderRadius: 2,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                          {explanation.title}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {explanation.description}
                        </Typography>
                        
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.5, mb: 0.5 }}>
                          Formula:
                        </Typography>
                        <Chip 
                          label={explanation.formula} 
                          size="small"
                          sx={{ 
                            mb: 1.5, 
                            fontFamily: 'monospace', 
                            fontWeight: 'bold',
                            bgcolor: 'rgba(255,255,255,0.2)'
                          }} 
                        />
                        
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.5, mb: 0.5 }}>
                          Emotion Weights:
                        </Typography>
                        
                        <Box sx={{ mb: 2, maxHeight: '120px', overflowY: 'auto' }}>
                          {explanation.weights.map((item, i) => (
                            <Box 
                              key={i} 
                              sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                py: 0.5,
                                borderBottom: i < explanation.weights.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                              }}
                            >
                              <Typography variant="body2">{item.emotion}</Typography>
                              <Typography variant="body2" fontWeight="bold">{item.weight}</Typography>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ fontSize: '0.8rem' }}>
                                ({item.impact})
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                          Interpretation:
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          {explanation.interpretation}
                        </Typography>
                      </Box>
                    </Collapse>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mt: 'auto',
                      pt: 2
                    }}>
                      <Chip
                        icon={<AccessTimeIcon fontSize="small" />}
                        label={indicator.timeWindow}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          color: '#fff'
                        }}
                      />
                      <Typography variant="caption">
                        Updated: {indicator.timestamp}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            );          })}
          </Grid>
        </motion.div>

        {/* Charts */}
        <Grid container spacing={3}>          {/* Radar Chart */}          <Grid item xs={12} md={6}>
            <motion.div variants={boxVariants}>
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(66, 165, 245, 0.1)',
                  boxShadow: '0 8px 32px rgba(66, 165, 245, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(66, 165, 245, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(66, 165, 245, 0.2)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BubbleChartIcon 
                    color="primary" 
                    sx={{ 
                      mr: 1, 
                      fontSize: 28,
                      background: 'linear-gradient(135deg, #42a5f5 0%, #2196f3 100%)',
                      color: 'white',
                      borderRadius: '50%',
                      p: 0.5,
                      boxShadow: '0 4px 12px rgba(66, 165, 245, 0.3)'
                    }} 
                  />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                    Emotion Distribution
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                {/* Emotion Type Dropdown */}
                <Box sx={{ mb: 3 }}>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="emotion-type-select-label">Emotion Data Type</InputLabel>
                    <Select
                      labelId="emotion-type-select-label"
                      id="emotion-type-select"
                      value={emotionType}
                      label="Emotion Data Type"
                      onChange={(e) => setEmotionType(e.target.value)}                    >
                      <MenuItem value="micro">Micro Emotions (5-min)</MenuItem>
                      <MenuItem value="macro">Macro Variations (24h)</MenuItem>
                      <MenuItem value="clinical">Clinical Trends (7-day)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>                <Box sx={{ 
                  height: 390, 
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.02) 0%, rgba(33, 150, 243, 0.08) 100%)',
                  borderRadius: 3,
                  p: 2
                }}>
                  <Radar 
                    ref={radarChartRef}
                    data={radarData} 
                    options={{
                      ...radarOptions,
                      animation: false,
                      maintainAspectRatio: true
                    }}
                    key="radar-chart-element"
                  />
                </Box><Typography variant="body2" color="textSecondary">
                  The radar chart shows your {
                    emotionType === 'clinical' ? 'clinical emotion trends (7-day averages)' :
                    emotionType === 'macro' ? 'macro emotion variations (24h averages)' : 
                    'current micro emotion distribution (5-min)'
                  } and how each emotion contributes to the depression score calculation.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <motion.div variants={boxVariants}>
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(76, 175, 80, 0.1)',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(76, 175, 80, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon 
                    color="primary" 
                    sx={{ 
                      mr: 1, 
                      fontSize: 28,
                      background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                      color: 'white',
                      borderRadius: '50%',
                      p: 0.5,
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                    }} 
                  />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#1b5e20' }}>
                    Score Comparison
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />                <Box sx={{ 
                  height: 450, 
                  mb: 2,
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.02) 0%, rgba(139, 195, 74, 0.08) 100%)',
                  borderRadius: 3,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bar 
                    ref={barChartRef}
                    data={barChartData}
                    options={{
                      ...barChartOptions,
                      animation: false
                    }}
                    key="bar-chart-element"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  This chart compares your depression scores across different time windows:
                  micro (5-minute), macro (24-hour), and clinical (long-term).
                </Typography>
              </Paper>
            </motion.div>
          </Grid>        </Grid>

        {/* Trend Chart */}
        {trendData && trendData.length > 0 && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <motion.div variants={boxVariants}>                <Paper 
                  elevation={4} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid rgba(33, 150, 243, 0.1)',
                    boxShadow: '0 8px 32px rgba(33, 150, 243, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(33, 150, 243, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(33, 150, 243, 0.2)',
                    }
                  }}
                >                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon 
                      color="primary" 
                      sx={{ 
                        mr: 1, 
                        fontSize: 28,
                        background: 'linear-gradient(135deg, #29b6f6 0%, #1976d2 100%)',
                        color: 'white',
                        borderRadius: '50%',
                        p: 0.5,
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                      }}
                    />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#1565c0' }}>
                      Depression Score Trends Over Time
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />                  <Box 
                    sx={{ 
                      height: 400, 
                      mb: 2,
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.02) 0%, rgba(25, 118, 210, 0.08) 100%)',
                      borderRadius: 3,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {formatTrendChartData(trendData, theme) ? (
                      <Line 
                        data={formatTrendChartData(trendData, theme)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          interaction: {
                            mode: 'index',
                            intersect: false,
                          },
                          animation: {
                            duration: 2000,
                            easing: 'easeOutQuart'
                          },
                          scales: {                            x: {
                              title: {
                                display: true,
                                text: 'Timestamp',
                                font: { size: 14, weight: 'bold' },
                                color: theme.palette.text.primary
                              },
                              ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                                color: theme.palette.text.secondary,
                                font: { size: 11 }
                              },
                              grid: {
                                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                drawOnChartArea: true,
                                drawTicks: true
                              }
                            },                            y: {
                              beginAtZero: true,
                              max: 1,
                              title: {
                                display: true,
                                text: 'Depression Score',
                                font: { size: 14, weight: 'bold' },
                                color: theme.palette.text.primary
                              },
                              ticks: {
                                stepSize: 0.1,
                                color: theme.palette.text.secondary,
                                font: { size: 11 },
                                callback: function(value) {
                                  return (value * 100).toFixed(0) + '%';
                                }
                              },
                              grid: {
                                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                drawOnChartArea: true,
                                drawTicks: true
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                boxWidth: 15,
                                padding: 15,
                                font: { size: 12 },
                                color: theme.palette.text.primary,
                                usePointStyle: true
                              }
                            },                            tooltip: {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)',
                              titleFont: { size: 14, weight: 'bold' },
                              bodyFont: { size: 13 },
                              titleColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
                              bodyColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2,
                              cornerRadius: 8,
                              displayColors: true,                              callbacks: {
                                label: function(context) {
                                  const score = context.parsed.y;
                                  const percentage = (score * 100).toFixed(1);
                                  let level = 'No Depression';
                                  if (score >= 0.40 && score <= 0.49) level = 'Mild Depression';
                                  else if (score >= 0.50 && score <= 0.69) level = 'Moderate Depression';
                                  else if (score >= 0.70 && score <= 0.85) level = 'Severe Depression';
                                  else if (score > 0.85) level = 'Very Severe Depression';
                                  
                                  return `${context.dataset.label}: ${percentage}% (${level})`;
                                }
                              }
                            }
                          },                          elements: {
                            line: {
                              borderJoinStyle: 'round',
                              borderCapStyle: 'round'
                            },
                            point: {
                              hoverRadius: 8,
                              hitRadius: 10
                            }
                          },
                          animation: {
                            duration: 1000,
                            easing: 'easeInOutCubic'
                          }
                        }}
                      />
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%',
                        flexDirection: 'column'
                      }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No Trend Data Available
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Trend data will appear when enough historical data is collected.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                    <Typography variant="body2" color="textSecondary">
                    This chart shows how your depression score has changed over the last hour with 60-minute weighted averages. 
                    The score is calculated using the weighted depression algorithm based on emotion analysis from multiple sources.
                    Track your mental health trends and patterns over time.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        )}

        {/* Info Card */}
        <motion.div variants={boxVariants} style={{ marginTop: '24px' }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: theme.palette.background.default }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InfoIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">
                About Depression Scores
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" paragraph>
              Depression scores are calculated based on emotional analysis from text, voice, and facial expressions.
              The scoring system ranges from 0 (no depression) to 1 (severe depression).
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Score ranges:</strong> 0.00-0.30 (No Depression), 0.30-0.49 (Mild), 
              0.50-0.69 (Moderate), 0.70-0.85 (Severe), 0.85-1.00 (Very Severe)
            </Typography>
          </Paper>
        </motion.div>

        {/* Email Error Alert (if exists) */}
        {emailError && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            {emailError}
          </Alert>
        )}
      </motion.div>
    </Container>
  );
};

export default DepressionPredictionsUI;
