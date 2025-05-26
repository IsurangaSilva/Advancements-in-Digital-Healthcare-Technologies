/**
 * DepressionPredictionsUI.jsx
 * 
 * This component handles the UI/presentation layer for depression predictions:
 * - Chart visualizations
 * - Score indicators with visual feedback
 * - Animations and responsive layout
 */

import React, { useRef } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Grid, Paper, Chip, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

// Import icons
import PsychologyIcon from '@mui/icons-material/Psychology';
import BarChartIcon from '@mui/icons-material/BarChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import InfoIcon from '@mui/icons-material/Info';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Import logic
import { formatChartData } from './DepressionPredictionsLogic';

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
  }

  const { microScore, macroScore, clinicalScore, averageEmotions } = predictionData;
  
  // Format chart data
  const charts = formatChartData(averageEmotions, theme);
  const barChartData = charts.bar.data(microScore, macroScore, clinicalScore);
  const radarData = charts.radar.data;
  
  // Chart options
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
  };

  const radarOptions = {
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
    },
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 1500,
      easing: 'easeOutCubic'
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
      >
        {/* Page Title */}
        <motion.div variants={boxVariants}>
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            Depression Prediction
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 4 }}>
            Analysis based on emotional indicators from text, voice, and facial expressions
          </Typography>
        </motion.div>        {/* Score Cards */}
        <motion.div style={{ width: '100%' }}>
          <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
            {indicators.map((indicator, index) => {
              const depressionInfo = getDepressionLevel(indicator.score);
              const IconComponent = getIconComponent(depressionInfo.icon);
            
            return (              <Grid item xs={12} md={4} key={indicator.level}>
                <motion.div variants={boxVariants} whileHover="hover" style={{ height: '100%' }}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      minHeight: '320px', // Set a consistent minimum height
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      backgroundImage: depressionInfo.gradient,
                      color: '#fff',
                      overflow: 'hidden'
                    }}
                  >                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="h2">
                        {indicator.level} Score
                      </Typography>
                      <motion.div variants={iconVariants} animate="visible" whileHover="pulse">
                        <IconComponent fontSize="large" />
                      </motion.div>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexGrow: 0 }}>
                      <motion.div variants={scoreNumberVariants}>
                        <Typography variant="h2" component="span" sx={{ fontWeight: 'bold' }}>
                          {indicator.score.toFixed(2)}
                        </Typography>
                      </motion.div>
                      <Chip
                        label={depressionInfo.level}
                        component={motion.div}
                        variants={chipVariants}
                        animate={indicator.score > 0.7 ? 'severe' : 'initial'}
                        sx={{ 
                          ml: 2,
                          color: '#fff',
                          backgroundColor: 'rgba(255,255,255,0.25)',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                      <Box sx={{ my: 2, height: 10, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 5 }}>
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
                    </Box><Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {depressionInfo.description}
                      </Typography>
                    </Box>
                    
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
        <Grid container spacing={3}>
          {/* Radar Chart */}
          <Grid item xs={12} md={6}>
            <motion.div variants={boxVariants}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BubbleChartIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    Emotion Distribution
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ height: 400, mb: 2 }}>
                  <Radar 
                    ref={radarChartRef}
                    data={radarData} 
                    options={radarOptions}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  The radar chart shows your current emotion distribution and how each emotion
                  contributes to the depression score calculation.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <motion.div variants={boxVariants}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    Score Comparison
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ height: 400, mb: 2 }}>
                  <Bar 
                    ref={barChartRef}
                    data={barChartData}
                    options={barChartOptions}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  This chart compares your depression scores across different time windows:
                  micro (5-minute), macro (24-hour), and clinical (long-term).
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

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
