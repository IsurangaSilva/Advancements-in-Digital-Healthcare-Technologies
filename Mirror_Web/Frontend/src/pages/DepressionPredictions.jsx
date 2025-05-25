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
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip,
  useTheme,
  Tooltip as MuiTooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InfoIcon from '@mui/icons-material/Info';
import ScaleIcon from '@mui/icons-material/Scale';
import BarChartIcon from '@mui/icons-material/BarChart';
import FunctionsIcon from '@mui/icons-material/Functions';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
// Import and register the parts of Chart.js we need
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
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
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState(false);
  const chartRef = useRef(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/depression/depressionprediction');
        const result = await response.json();
        
        if (result.error) {
          setError(result.error);
        } else {
          setPredictionData(result);
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

  // Helper function to get depression level color
  const getDepressionLevelColor = (rating) => {
    switch(rating.toLowerCase()) {
      case 'minimal': return '#4caf50'; // Green
      case 'mild': return '#8bc34a';    // Light Green
      case 'moderate': return '#ff9800'; // Orange
      case 'severe': return '#f44336';  // Red
      default: return '#2196f3';        // Blue (default)
    }
  };
  
  // Helper function to get depression level emoji
  const getDepressionLevelEmoji = (rating) => {
    switch(rating.toLowerCase()) {
      case 'minimal': return '😊';
      case 'mild': return '🙂';
      case 'moderate': return '😐';
      case 'severe': return '😔';
      default: return '❓';
    }
  };

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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ 
            p: 2, 
            borderRadius: 2,
            fontSize: '1rem'
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!predictionData) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert 
          severity="info" 
          variant="filled" 
          sx={{ 
            p: 2, 
            borderRadius: 2,
            fontSize: '1rem'
          }}
        >
          No depression prediction data available
        </Alert>
      </Container>
    );
  }
  // Prepare data for the radar chart
  const { averageDepressionScore, rating, averageEmotions } = predictionData;
  
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
  
  // Chart options
  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        pointLabels: {
          font: {
            size: 14,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold'
          }
        },
        ticks: {
          backdropColor: 'transparent',
          color: 'rgba(0, 0, 0, 0.6)',
          font: {
            size: 10
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        displayColors: false
      }
    },
    maintainAspectRatio: true,
    responsive: true
  };
  
  // Depression level color
  const levelColor = getDepressionLevelColor(rating);
  const levelEmoji = getDepressionLevelEmoji(rating);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              background: `linear-gradient(45deg, ${levelColor} 30%, ${levelColor}99 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <PsychologyIcon sx={{ fontSize: 40 }} />
            Depression Analysis
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
            Comprehensive assessment of depression indicators based on emotional patterns
          </Typography>
        </Box>
      </motion.div>
      
      <Grid container spacing={4}>
        {/* Depression Score Overview */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                borderRadius: 3,
                background: `linear-gradient(to bottom, white, white, ${levelColor}15)`,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScaleIcon sx={{ mr: 1.5, color: levelColor, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={600}>
                  Depression Assessment
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    py: 3
                  }}>
                    <Box sx={{ 
                      width: 110, 
                      height: 110, 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(45deg, ${levelColor}99 30%, ${levelColor} 90%)`,
                      boxShadow: `0 4px 20px ${levelColor}50`,
                      mb: 2,
                      fontSize: '2.5rem'
                    }}>
                      {levelEmoji}
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: levelColor, mb: 0.5 }}>
                      {rating}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Depression Level
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.03)'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        Depression Score:
                      </Typography>
                      <Typography 
                        variant="h5" 
                        fontWeight={700}
                        sx={{ color: levelColor }}
                      >
                        {averageDepressionScore.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      mt: 1,
                      height: 8, 
                      bgcolor: 'rgba(0, 0, 0, 0.09)',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(averageDepressionScore / 1.0 * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                          height: '100%',
                          backgroundColor: levelColor,
                          borderRadius: 4
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">0</Typography>
                      <Typography variant="caption" color="text.secondary">1.0</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Typography variant="body1" fontWeight={500}>
                  Key Indicators:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {['Sadness', 'Anger', 'Fear', 'Joy', 'Neutral'].map(emotion => (
                    <Chip 
                      key={emotion} 
                      label={emotion} 
                      size="small"
                      sx={{ 
                        bgcolor: emotion === 'Sadness' || emotion === 'Anger' || emotion === 'Fear' 
                          ? `${levelColor}30` 
                          : 'rgba(0, 0, 0, 0.08)',
                        color: emotion === 'Sadness' || emotion === 'Anger' || emotion === 'Fear'
                          ? levelColor
                          : 'text.primary',
                        fontWeight: emotion === 'Sadness' ? 500 : 400
                      }} 
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        
        {/* Radar Chart */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                height: '100%',
                borderRadius: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BubbleChartIcon sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={600}>
                  Emotional Pattern Analysis
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ 
                height: 350,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Radar 
                  data={radarData} 
                  options={radarOptions}
                  ref={chartRef}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                The radar chart visualizes the distribution of different emotions detected in your communications.
                Higher values of sadness, anger, and fear may correlate with depression indicators.
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        
        {/* Depression Algorithm Explanation */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Accordion 
              expanded={expandedSection === 'algorithm'} 
              onChange={handleAccordionChange('algorithm')}
              sx={{
                borderRadius: 3,
                '&:before': {
                  display: 'none',
                },
                boxShadow: 3
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  borderRadius: expandedSection === 'algorithm' ? '12px 12px 0 0' : 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FunctionsIcon sx={{ mr: 1.5 }} />
                  <Typography variant="h6" fontWeight={500}>
                    Understanding the Depression Detection Algorithm
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 4, bgcolor: 'rgba(0, 0, 0, 0.01)' }}>
                <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3, color: theme.palette.primary.main }}>
                  Depression Detection Algorithm: Step by Step Explanation
                </Typography>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  🔍 The Goal: Normalize the Raw Score
                </Typography>
                <Typography variant="body1" paragraph>
                  We convert the raw depression score (Sₜ), which can be any value from -1.3 to +2.3, into a number between 0 and 1. 
                  This is called normalization.
                </Typography>
                <Typography variant="body1" paragraph>
                  📈 Why? Because values between 0 and 1 are easier to interpret, compare, visualize (e.g., on a graph), 
                  and categorize into levels like "mild," "moderate," etc.
                </Typography>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  📏 Step 1: Understand the Raw Score Range
                </Typography>
                <Typography variant="body1" paragraph>
                  We calculate the raw score Sₜ using:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2, my: 2 }}>
                  <Typography variant="body1" fontFamily="monospace">
                    Sₜ = ∑ P(c)ₜ · w(c)
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Where:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      P(c)ₜ: probability of emotion c at time t
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      w(c): clinical weight for emotion c
                    </Typography>
                  </li>
                </ul>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  ✅ Clinical Weights Used
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                      <tr style={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Emotion</th>
                        <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Weight w(c)</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 500 }}>Sadness</td>
                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>+1.0</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>Strong depression signal</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 500 }}>Anger</td>
                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>+0.7</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>Common in depression</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 500 }}>Fear</td>
                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>+0.6</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>Anxiety-related</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 500 }}>Neutral</td>
                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>0.0</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>No impact</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 500 }}>Joy</td>
                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>-1.0</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>Opposite of depression</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 500 }}>Surprise</td>
                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>-0.3</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>Mildly counter-depressive</td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  🔽 What's the lowest possible score (Sₜ)?
                </Typography>
                <Typography variant="body1" paragraph>
                  Let's say the person only shows Joy and Surprise, both at 100% (which is rare but mathematically possible):
                </Typography>
                <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2, my: 2, fontFamily: 'monospace' }}>
                  <Typography variant="body1">
                    Sₘᵢₙ = (1.0 × -1.0) + (1.0 × -0.3) = -1.0 - 0.3 = -1.3
                  </Typography>
                </Box>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  🔼 What's the highest possible score (Sₜ)?
                </Typography>
                <Typography variant="body1" paragraph>
                  Let's say the person only shows Sadness (1.0), Anger (1.0), and Fear (1.0):
                </Typography>
                <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2, my: 2, fontFamily: 'monospace' }}>
                  <Typography variant="body1">
                    Sₘₐₓ = (1.0 × 1.0) + (1.0 × 0.7) + (1.0 × 0.6) = 1.0 + 0.7 + 0.6 = 2.3
                  </Typography>
                </Box>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  📘 Why Add 1.3?
                </Typography>
                <Typography variant="body1" paragraph>
                  💡 We need to shift the entire range to start from 0.
                </Typography>
                <Typography variant="body1" paragraph>
                  Currently:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      Minimum Sₜ = -1.3
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      Maximum Sₜ = 2.3
                    </Typography>
                  </li>
                </ul>
                <Typography variant="body1" paragraph>
                  We add 1.3 to every raw score to move the range:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2, my: 2, fontFamily: 'monospace' }}>
                  <Typography variant="body1">
                    [-1.3, 2.3] → [0, 3.6]
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  This makes all values positive and easier to normalize.
                </Typography>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  📗 Why Divide by 3.6?
                </Typography>
                <Typography variant="body1" paragraph>
                  After the shift, the new range is from 0 to 3.6. To scale it down to the standard [0, 1] range, we divide by 3.6:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2, my: 2, fontFamily: 'monospace' }}>
                  <Typography variant="body1">
                    Dₜ = (Sₜ + 1.3) / 3.6
                  </Typography>
                </Box>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  ✅ Final Formula for Depression Index Dₜ:
                </Typography>
                <Box sx={{ bgcolor: theme.palette.primary.main + '20', p: 2, borderRadius: 2, my: 2, fontFamily: 'monospace', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                  <Typography variant="h6" fontWeight={600}>
                    Dₜ = (Sₜ + 1.3) / 3.6
                  </Typography>
                </Box>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  📊 Example Breakdown
                </Typography>
                <Typography variant="body1" paragraph>
                  Let's walk through a real example step by step.
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Fused Emotion Probabilities:
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '70%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                      <tr style={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Emotion</th>
                        <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Probability</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>Anger</td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0.12</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>Fear</td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0.10</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>Joy</td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0.20</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>Neutral</td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0.30</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>Sadness</td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0.22</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>Surprise</td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0.06</td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Apply Clinical Weights:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2, my: 2, fontFamily: 'monospace' }}>
                  <Typography variant="body1">
                    Sₜ = (0.12 ⋅ 0.7) + (0.10 ⋅ 0.6) + (0.20 ⋅ -1.0) + (0.30 ⋅ 0.0) + (0.22 ⋅ 1.0) + (0.06 ⋅ -0.3)
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Sₜ = 0.084 + 0.06 - 0.20 + 0 + 0.22 - 0.018 = 0.146
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Normalize:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2, my: 2, fontFamily: 'monospace' }}>
                  <Typography variant="body1">
                    Sₜ + 1.3 = 0.146 + 1.3 = 1.446
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Dₜ = 1.446 / 3.6 ≈ 0.402
                  </Typography>
                </Box>
                
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  📘 Real-World Analogy
                </Typography>
                <Typography variant="body1" paragraph>
                  Imagine a school gives students scores between -13 to +23 (instead of 0 to 100). It would be confusing!
                </Typography>
                <Typography variant="body1" paragraph>
                  To make it easier:
                </Typography>
                <ol>
                  <li>
                    <Typography variant="body1">
                      Add 13 to make the lowest score 0 → now it's [0, 36]
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      Divide by 36 to scale to [0, 1] → now every score is a percentage
                    </Typography>
                  </li>
                </ol>
                <Typography variant="body1">
                  This is exactly what we're doing here.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DepressionPredictions;
