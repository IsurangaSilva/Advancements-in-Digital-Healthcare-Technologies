import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Paper,
  Grid,
  useTheme,
  Avatar,
  LinearProgress,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import MoodIcon from "@mui/icons-material/Mood";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import PsychologyIcon from "@mui/icons-material/Psychology";
import RecommendIcon from "@mui/icons-material/Recommend";

// Utility function to convert Markdown to plain text
const stripMarkdown = (markdown) => {
  if (!markdown) return "";

  return markdown
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // Remove bold (**text** or __text__)
    .replace(/(\*|_)(.*?)\1/g, "$2") // Remove italics (*text* or _text_)
    .replace(/#{1,6}\s/g, "") // Remove headers (# Header)
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images (![alt](url))
    .replace(/\[(.+?)\]\(.*?\)/g, "$1") // Convert links ([text](url)) to text
    .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // Remove code (```code``` or `code`)
    .replace(/^\s*[-+*]\s+/gm, "") // Remove bullet points (-, *, +)
    .replace(/\n{2,}/g, "\n") // Reduce multiple newlines to single
    .trim(); // Trim whitespace
};

const Recommendations = () => {
  const [emotions, setEmotions] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 1 }
    }
  };
  
  const titleVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.3
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 30px rgba(0,0,0,0.15)",
      transition: { duration: 0.3 }
    }
  };
  
  // Helper function to get emotion icon
  const getEmotionIcon = (emotion, value) => {
    if (emotion === "joy" || emotion === "neutral") {
      return value > 0.5 ? <SentimentSatisfiedAltIcon /> : <SentimentSatisfiedIcon />;
    } else if (emotion === "sadness") {
      return <SentimentDissatisfiedIcon />;
    } else if (emotion === "anger" || emotion === "fear") {
      return <SentimentVeryDissatisfiedIcon />;
    } else {
      return <MoodIcon />;
    }
  };
  
  // Get emotion color
  const getEmotionColor = (emotion) => {
    switch(emotion) {
      case "joy":
        return "#4caf50";
      case "sadness":
        return "#5c6bc0";
      case "anger":
        return "#f44336";
      case "fear":
        return "#ff9800";
      case "surprise":
        return "#9c27b0";
      case "neutral":
        return "#2196f3";
      default:
        return "#607d8b";
    }
  };

  // Fetch emotion data from MongoDB via API
  const fetchEmotionData = async () => {
    try {
      console.log("Fetching data from API: http://localhost:4000/api/average/combined-5min-weighted-average");
      const response = await fetch("http://localhost:4000/api/average/combined-5min-weighted-average", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      // Expecting data to be an array or object with weightedAverages
      let weightedAverages = null;
      if (Array.isArray(data)) {
        // If API returns an array, take the first element
        weightedAverages = data[0]?.weightedAverages;
      } else if (data.weightedAverages) {
        weightedAverages = data.weightedAverages;
      } else if (data.emotions && Array.isArray(data.emotions) && data.emotions[0]?.weightedAverages) {
        // If wrapped in 'emotions' array
        weightedAverages = data.emotions[0].weightedAverages;
      }

      if (!weightedAverages) {
        throw new Error("No weightedAverages found in API response: " + JSON.stringify(data));
      }

      // Return as a single session array for compatibility
      return [weightedAverages];
    } catch (err) {
      console.error("Error fetching emotion data:", err);
      setError(err.message);
      return null;
    }
  };

  // Calculate average emotion scores across all sessions (now expects array of weightedAverages objects)
  const calculateEmotionAverages = (sessions) => {
    if (!sessions || sessions.length === 0) return null;
    // Only one session expected, but keep logic for future-proofing
    const emotionTotals = {
      anger: 0,
      fear: 0,
      joy: 0,
      neutral: 0,
      sadness: 0,
      surprise: 0,
    };
    let validSessions = 0;
    sessions.forEach((scores) => {
      if (scores) {
        emotionTotals.anger += scores.anger || 0;
        emotionTotals.fear += scores.fear || 0;
        emotionTotals.joy += scores.joy || 0;
        emotionTotals.neutral += scores.neutral || 0;
        emotionTotals.sadness += scores.sadness || 0;
        emotionTotals.surprise += scores.surprise || 0;
        validSessions += 1;
      }
    });
    if (validSessions === 0) return null;
    const averages = {
      anger: emotionTotals.anger / validSessions,
      fear: emotionTotals.fear / validSessions,
      joy: emotionTotals.joy / validSessions,
      neutral: emotionTotals.neutral / validSessions,
      sadness: emotionTotals.sadness / validSessions,
      surprise: emotionTotals.surprise / validSessions,
    };
    console.log("Calculated Emotion Averages:", averages);
    return averages;
  };

  // Fetch AI recommendation from OpenRouter API
  const fetchRecommendation = async (avgEmotions) => {
    setLoading(true);
    const OPENROUTER_API_KEY = "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";
    const YOUR_SITE_URL = "http://localhost:3000";
    const YOUR_SITE_NAME = "Mental Health App";    const prompt = `
      As a healthcare professional, you are reviewing the following emotional data for your patient:
      Joy: ${avgEmotions.joy.toFixed(4)},
      Sadness: ${avgEmotions.sadness.toFixed(4)},
      Anger: ${avgEmotions.anger.toFixed(4)},
      Fear: ${avgEmotions.fear.toFixed(4)},
      Surprise: ${avgEmotions.surprise.toFixed(4)},
      Neutral: ${avgEmotions.neutral.toFixed(4)}.
      
      Please provide professional recommendations for how to best support this patient's mental health needs. Format your response as clear, actionable bullet points that a healthcare professional could implement. Include specific approaches for addressing any concerning emotions detected in the data.
    `;

    const requestBody = {
      model: "deepseek/deepseek-r1-zero:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };
    console.log("OpenRouter Request Body:", requestBody);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": YOUR_SITE_URL,
          "X-Title": YOUR_SITE_NAME,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("OpenRouter Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch AI recommendation: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("AI Recommendation Response:", data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response format from OpenRouter API");
      }      const aiResponse = data.choices[0].message.content;
      
      // Format the response for better readability
      let plainTextResponse = stripMarkdown(aiResponse); // First remove markdown
      
      // Strip any JSON formatting if present
      plainTextResponse = plainTextResponse.replace(/^\s*[\{\[].*?[\}\]]\s*$/gms, (match) => {
        try {
          // Try to parse as JSON and extract any useful text
          const parsed = JSON.parse(match);
          if (parsed.recommendations) {
            return parsed.recommendations.map(rec => 
              typeof rec === 'string' ? rec : rec.text || rec.recommendation || rec.category || ''
            ).join(' ');
          }
          return Object.values(parsed).join(' ');
        } catch (e) {
          // If it's not valid JSON, just remove JSON-like syntax
          return match.replace(/[{}\[\]"]/g, '')
            .replace(/:\s*/g, ': ')
            .replace(/,\s*/g, '. ');
        }
      });
      
      // Remove boxed notation if present (like \boxed{...})
      plainTextResponse = plainTextResponse.replace(/\\boxed\s*\{\s*(.*?)\s*\}/gs, '$1');
      
      // Remove any code block markers
      plainTextResponse = plainTextResponse.replace(/```\w*\n|\n```/g, '');
      
      // Remove any emotion score references (e.g., "Joy: 0.5550, ")
      plainTextResponse = plainTextResponse.replace(/\b(Joy|Sadness|Anger|Fear|Surprise|Neutral):\s*\d+\.\d+,?\s*/g, '');
      
      // If we have sections with labels like "Daily:", "Weekly:", extract them as separate items
      if (/\b(Daily|Weekly|Monthly|Yearly):/i.test(plainTextResponse)) {
        const timePatterns = plainTextResponse.match(/\b(Daily|Weekly|Monthly|Yearly):[^.!?]+(\.|\!|\?)/gi) || [];
        if (timePatterns.length > 0) {
          plainTextResponse = timePatterns.map(pattern => `• ${pattern.trim()}`).join('\n\n');
        }
      } 
      // Otherwise, convert paragraphs to bullet points if not already in point form
      else if (!plainTextResponse.includes('•') && !plainTextResponse.includes('- ')) {
        // Split by sentences or periods, ignoring periods in numbers and abbreviations
        const sentences = plainTextResponse
          .replace(/\r\n|\n|\r/g, ' ') // Normalize line breaks
          .split(/(?<=[.!?])\s+(?=[A-Z])/)
          .filter(s => s.trim().length > 0);
        
        plainTextResponse = sentences
          .filter(sentence => sentence.trim().length > 10) // Only keep meaningful sentences
          .map(sentence => `• ${sentence.trim()}`)
          .join('\n\n');
      }
      
      setRecommendation(plainTextResponse);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setRecommendation(`Sorry, we couldn't generate a recommendation at this time. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data and generate recommendation on component mount
  useEffect(() => {
    const getDataAndRecommend = async () => {
      setLoading(true);
      const sessions = await fetchEmotionData();
      if (sessions) {
        const avgEmotions = calculateEmotionAverages(sessions);
        if (avgEmotions) {
          setEmotions(avgEmotions);
          await fetchRecommendation(avgEmotions);
        } else {
          setError("No valid emotion scores available to average");
        }
      }
      setLoading(false);
    };
    getDataAndRecommend();
  }, []);

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #e8eef3 0%, #f5f7fa 100%)",
        minHeight: "100vh",
        padding: { xs: "40px 0", md: "60px 0" },
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative elements */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 1.5 }}
        sx={{ 
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0) 70%)",
          zIndex: 0
        }}
      />
      
      <Box 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        sx={{ 
          position: "absolute",
          bottom: "5%",
          right: "5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0) 70%)",
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
        {/* Enhanced Header */}
        <Box sx={{ textAlign: "center", py: { xs: 4, md: 6 }, position: "relative", zIndex: 1 }}>
          <motion.div variants={titleVariants}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: "#1a3c5e", 
                  width: 60, 
                  height: 60, 
                  mr: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              >
                <PsychologyIcon sx={{ fontSize: 40 }} />
              </Avatar>              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: "#1a3c5e",
                  fontSize: { xs: "32px", md: "48px" },
                  letterSpacing: "0.5px",
                  background: "linear-gradient(45deg, #1a3c5e 30%, #4a8db7 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Patient Care Recommendations
              </Typography>
            </Box>
          </motion.div>
          
          <motion.div variants={fadeInVariants}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#566573",
                fontSize: { xs: "16px", md: "20px" },
                maxWidth: "800px",
                mx: "auto",
                mb: { xs: 4, md: 6 },
                fontWeight: 300,
                lineHeight: 1.6
              }}
            >
              Based on your patient's emotional data analysis, here are professional recommendations to help support their mental well-being.
            </Typography>
          </motion.div>

        {/* Main Content - Enhanced with animations */}
        <motion.div variants={cardVariants} whileHover="hover">
          <Container maxWidth="md">
            <Card
              sx={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(26, 60, 94, 0.15)",
                p: { xs: 2, sm: 4 },
                overflow: "hidden",
                position: "relative"
              }}
            >
              {/* Decorative card elements */}
              <Box 
                sx={{ 
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #1a3c5e, #4a8db7)"
                }} 
              />
              
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {loading ? (
                  <Box 
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    sx={{ 
                      textAlign: "center", 
                      py: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <CircularProgress 
                      sx={{ 
                        color: "#1a3c5e",
                        mb: 3
                      }} 
                      size={60}
                      thickness={4}
                    />
                    <Typography 
                      variant="h6"
                      sx={{ 
                        mt: 2, 
                        color: "#566573",
                        fontWeight: 500 
                      }}
                    >
                      Processing patient emotional data...
                    </Typography>
                  </Box>
                ) : emotions ? (
                  <>
                    <motion.div variants={itemVariants}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Avatar sx={{ bgcolor: "#1a3c5e", mr: 2 }}>
                          <MoodIcon />
                        </Avatar>
                        <Typography                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            color: "#1a3c5e",
                            textTransform: "uppercase",
                          }}
                        >
                          Patient Emotional Profile
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mb: 4 }}>
                        {Object.entries(emotions).map(([emotion, value], index) => (
                          <Grid item xs={12} sm={6} key={emotion}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                            >
                              <Paper 
                                elevation={1}
                                sx={{ 
                                  p: 2, 
                                  borderRadius: 2,
                                  background: `linear-gradient(to right, ${getEmotionColor(emotion)}10, ${getEmotionColor(emotion)}05)`,
                                  border: `1px solid ${getEmotionColor(emotion)}30`,
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: `${getEmotionColor(emotion)}20`, 
                                      color: getEmotionColor(emotion),
                                      width: 32,
                                      height: 32,
                                      mr: 1.5
                                    }}
                                  >
                                    {getEmotionIcon(emotion, value)}
                                  </Avatar>
                                  <Typography
                                    variant="body1"
                                    sx={{ 
                                      color: "#333", 
                                      textTransform: "capitalize",
                                      fontWeight: 600
                                    }}
                                  >
                                    {emotion}
                                  </Typography>
                                  <Box sx={{ ml: "auto" }}>
                                    <Chip 
                                      label={`${(value * 100).toFixed(1)}%`} 
                                      size="small"
                                      sx={{
                                        bgcolor: getEmotionColor(emotion),
                                        color: "#fff",
                                        fontWeight: 600
                                      }}
                                    />
                                  </Box>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={value * 100}
                                  sx={{ 
                                    borderRadius: 5,
                                    height: 8,
                                    bgcolor: `${getEmotionColor(emotion)}20`,
                                    ".MuiLinearProgress-bar": {
                                      bgcolor: getEmotionColor(emotion) 
                                    }
                                  }} 
                                />
                              </Paper>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    </motion.div>

                    <Divider 
                      sx={{ 
                        my: 4,
                        "&::before, &::after": {
                          borderColor: "rgba(26, 60, 94, 0.2)",
                        }
                      }}
                    >
                      <Chip 
                        icon={<RecommendIcon />}
                        label="Recommendations" 
                        sx={{ 
                          bgcolor: "#1a3c5e", 
                          color: "#fff",
                          fontWeight: 600,
                          px: 1
                        }}
                      />
                    </Divider>

                    <motion.div variants={itemVariants}>
                      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ bgcolor: "#1a3c5e", mr: 2 }}>
                          <RecommendIcon />
                        </Avatar>
                        <Typography
                          variant="h5"
                          sx={{                            fontWeight: 600,
                            color: "#1a3c5e",
                            textTransform: "uppercase",
                          }}
                        >
                          Professional Care Suggestions
                        </Typography>
                      </Box>                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          borderRadius: 2,
                          bgcolor: "rgba(26, 60, 94, 0.03)",
                          border: "1px dashed rgba(26, 60, 94, 0.2)"
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#333",
                            lineHeight: 2,
                            fontSize: "16px",
                            fontWeight: 300,
                            whiteSpace: 'pre-line', // Preserve line breaks
                            '& ::marker': { // Style for bullet points
                              color: theme.palette.primary.main,
                              fontWeight: 'bold'
                            }
                          }}
                          component="div" // Use div to support whitespace formatting
                        >
                          {recommendation}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 2,
                        bgcolor: "#ffebee",
                        border: "1px solid #ffcdd2",
                        textAlign: "center",
                      }}
                    >
                      <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#d32f2f", mb: 2, opacity: 0.7 }} />
                      <Typography
                        variant="h6"
                        sx={{ color: "#d32f2f", py: 1, fontWeight: 600 }}
                      >
                        Error Loading Data
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#d32f2f" }}
                      >
                        {error || "Unable to load emotional data. Please try again later."}
                      </Typography>
                    </Paper>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </Container>
        </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Recommendations;
