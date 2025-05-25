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
  Chip
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BarChartIcon from '@mui/icons-material/BarChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import InfoIcon from '@mui/icons-material/Info';
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
        const response = await fetch('http://localhost:4000/api/depression/depressionprediction');
        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          const data = {
            ...result,
            microScore: 0.35, // Mock data
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
  }, []);

  // Determine color and level based on score
  const getDepressionLevel = (score) => {
    if (score <= 0.25) return { level: 'Minimal', color: '#4caf50' };
    if (score <= 0.5) return { level: 'Mild', color: '#8bc34a' };
    if (score <= 0.75) return { level: 'Moderate', color: '#ff9800' };
    return { level: 'Severe', color: '#f44336' };
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
        },
        ticks: {
          stepSize: 0.25,
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
  };

  const radarOptions = {
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
          color: theme.palette.text.primary
        },
        ticks: {
          backdropColor: 'transparent',
          color: theme.palette.text.secondary,
          font: { size: 10 }
        }
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

  // Indicator configurations
  const indicators = [
    {
      level: 'Micro',
      timeWindow: '5 min',
      usedFor: 'Emotion detection per input session',
      score: microScore,
      description: 'Analyzes immediate emotional responses within a short time frame.'
    },
    {
      level: 'Macro',
      timeWindow: '24h average',
      usedFor: 'Daily depression estimation (Dt)',
      score: macroScore,
      description: 'Evaluates average emotional patterns over a day for consistent trends.'
    },
    {
      level: 'Clinical',
      timeWindow: '7-day trend',
      usedFor: 'Alerting and clinical summary',
      score: clinicalScore,
      description: 'Assesses long-term patterns to inform clinical decisions.'
    }
  ];

  // Animation variants
  const boxVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.02, boxShadow: `0 6px 16px rgba(0, 0, 0, 0.15)` }
  };

  const chipVariants = {
    initial: { scale: 1 },
    highScore: {
      scale: [1, 1.1, 1],
      transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <PsychologyIcon sx={{ fontSize: 40 }} />
            </motion.div>
            Depression Analysis
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Comprehensive assessment of depression indicators based on emotional patterns
          </Typography>
        </Box>
      </motion.div>

      {/* Email Error Alert */}
      {emailError && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error" variant="filled" sx={{ p: 2, borderRadius: 2, fontSize: '1rem' }}>
            {emailError}
          </Alert>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Depression Scores Row */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {indicators.map((indicator, index) => {
              const { level, color } = getDepressionLevel(indicator.score);
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
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        background: theme.palette.mode === 'dark' ? '#333' : 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
                        boxShadow: `0 4px 12px ${color}20`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${color}30`
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight={600} sx={{ color }}>
                          {indicator.level} Score
                        </Typography>
                        <MuiTooltip title={indicator.description}>
                          <InfoIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        </MuiTooltip>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" fontWeight={700} sx={{ color, mr: 2 }}>
                          {indicator.score.toFixed(2)}
                        </Typography>
                        <motion.div
                          variants={chipVariants}
                          initial="initial"
                          animate={indicator.score > 0.85 ? 'highScore' : 'initial'}
                        >
                          <Chip
                            label={level}
                            size="small"
                            sx={{
                              bgcolor: `${color}30`,
                              color,
                              fontWeight: 500,
                              borderRadius: 1,
                              px: 1,
                              boxShadow: indicator.score > 0.85 ? `0 0 8px ${color}50` : 'none'
                            }}
                          />
                        </motion.div>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {indicator.usedFor} ({indicator.timeWindow})
                      </Typography>
                      <Box sx={{ height: 8, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', borderRadius: 4, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(indicator.score * 100, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            backgroundColor: color,
                            borderRadius: 4
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">0</Typography>
                        <Typography variant="caption" color="text.secondary">1.0</Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Bar Chart */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark' ? '#333' : '#ffffff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <BarChartIcon sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }} />
                    </motion.div>
                    <Typography variant="h5" fontWeight={600}>
                      Depression Score Comparison
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ height: 350 }}>
                    <Bar data={barChartData} options={barChartOptions} ref={barChartRef} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    Comparison of Micro, Macro, and Clinical depression scores. Higher scores indicate greater severity.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>

            {/* Radar Chart */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark' ? '#333' : '#ffffff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <BubbleChartIcon sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }} />
                    </motion.div>
                    <Typography variant="h5" fontWeight={600}>
                      Emotional Pattern Analysis
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Radar data={radarData} options={radarOptions} ref={radarChartRef} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    The radar chart visualizes the distribution of different emotions detected in your communications.
                    Higher values of sadness, anger, and fear may correlate with depression indicators.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DepressionPredictions;