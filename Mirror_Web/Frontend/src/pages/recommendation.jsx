import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from "@mui/material";

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

  // Fetch emotion data from MongoDB via API
  const fetchEmotionData = async () => {
    try {
      console.log("Fetching data from API: http://localhost:4000/api/text/textaggregateemotions");
      const response = await fetch("http://localhost:4000/api/text/textaggregateemotions", {
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

      if (!data || typeof data !== "object" || !Array.isArray(data.emotions)) {
        throw new Error("Invalid response format: 'emotions' array not found - " + JSON.stringify(data));
      }

      const sessions = data.emotions;
      if (sessions.length === 0) {
        throw new Error("No emotion data found in response (empty emotions array)");
      }

      const hasSessionAggregate = sessions.some((session) => session.session_aggregate);
      console.log("Has Session Aggregate:", hasSessionAggregate);
      if (!hasSessionAggregate) {
        throw new Error("No session_aggregate found in any session");
      }

      return sessions;
    } catch (err) {
      console.error("Error fetching emotion data:", err);
      setError(err.message);
      return null;
    }
  };

  // Calculate average emotion scores across all sessions
  const calculateEmotionAverages = (sessions) => {
    if (!sessions || sessions.length === 0) return null;

    const emotionTotals = {
      anger: 0,
      fear: 0,
      joy: 0,
      neutral: 0,
      sadness: 0,
      surprise: 0,
    };

    let validSessions = 0;
    sessions.forEach((session) => {
      const scores = session.session_aggregate;
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
    const YOUR_SITE_NAME = "Mental Health App";

    const prompt = `
      Based on the following averaged emotion data from a user's sessions:
      Joy: ${avgEmotions.joy.toFixed(4)},
      Sadness: ${avgEmotions.sadness.toFixed(4)},
      Anger: ${avgEmotions.anger.toFixed(4)},
      Fear: ${avgEmotions.fear.toFixed(4)},
      Surprise: ${avgEmotions.surprise.toFixed(4)},
      Neutral: ${avgEmotions.neutral.toFixed(4)},
      provide personalized recommendations to help the user maintain their mental health and well-being.
    `;

    const requestBody = {
      model: "deepseek/deepseek-r1-distill-llama-70b:free",
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
      }

      const aiResponse = data.choices[0].message.content;
      const plainTextResponse = stripMarkdown(aiResponse); // Convert Markdown to plain text
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
    <div
      style={{
        background: "linear-gradient(135deg, #e8eef3 0%, #f5f7fa 100%)",
        minHeight: "100vh",
        padding: "60px 0",
      }}
    >
      <Box sx={{ textAlign: "center", py: 6 }}>
        {/* Header */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "#1a3c5e",
            fontSize: { xs: "32px", md: "48px" },
            mb: 2,
            letterSpacing: "1px",
          }}
        >
          Your Personalized Recommendations
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#666",
            fontSize: "20px",
            maxWidth: "800px",
            mx: "auto",
            mb: 6,
          }}
        >
          Based on your emotional data, here’s how you can maintain your mental well-being.
        </Typography>

        {/* Main Content */}
        <Container maxWidth="md">
          <Card
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              p: 4,
            }}
          >
            <CardContent>
              {loading ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#1a3c5e" }} />
                  <Typography sx={{ mt: 2, color: "#666" }}>
                    Loading your emotional data...
                  </Typography>
                </Box>
              ) : emotions ? (
                <>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "#1a3c5e",
                      mb: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    Your Emotional Profile
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    {Object.entries(emotions).map(([emotion, value]) => (
                      <Box
                        key={emotion}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 1,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ color: "#555", textTransform: "capitalize" }}
                        >
                          {emotion}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#1a3c5e", fontWeight: 600 }}>
                          {(value * 100).toFixed(2)}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "#1a3c5e",
                      mb: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    AI-Powered Recommendations
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#555",
                      lineHeight: 1.8,
                      fontSize: "16px",
                      textAlign: "justify",
                    }}
                  >
                    {recommendation}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="body1"
                  sx={{ color: "#d32f2f", py: 4, textAlign: "center" }}
                >
                  Error: {error || "Unable to load emotional data"}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </div>
  );
};

export default Recommendations;