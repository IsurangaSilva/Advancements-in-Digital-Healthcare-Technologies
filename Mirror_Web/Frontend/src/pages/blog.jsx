import React from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Divider,
} from "@mui/material";

// Image Imports
import B1 from "../assets/images/B1.jpg";
import B2 from "../assets/images/B2.jpg";
import B3 from "../assets/images/B3.jpg";

const Blog = () => {
  return (
    <div
      style={{
        background: "linear-gradient(to right, rgba(243, 232, 222, 0.5), rgba(231, 245, 247, 0.5))",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      <Box sx={{ textAlign: "center", padding: "60px 20px" }}>
        {/* Blog Header */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "#1a3c5e",
            marginBottom: "20px",
            fontSize: { xs: "32px", md: "48px" },
            letterSpacing: "1px",
          }}
        >
          Revolutionizing Mental Health: AI-Powered Depression Detection
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#777",
            fontSize: "20px",
            mb: 5,
            fontStyle: "italic",
          }}
        >
          Exploring a Multi-Modal Approach to Enhance Emotional Well-Being
        </Typography>

        {/* Main Content */}
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
              {/* Introduction Section */}
              <Box sx={{ my: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#1a3c5e",
                    mb: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Introduction
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    lineHeight: 2,
                    color: "#555",
                    mb: 3,
                    fontSize: "16px",
                  }}
                >
                  Depression impacts millions globally, posing immense challenges to both individuals and healthcare systems. Early detection and timely intervention are vital for effective management, yet traditional methods often depend on self-reported symptoms, leading to delays and inaccuracies. Our research introduces an innovative multi-modal AI-driven system that leverages voice, text, and facial expressions for real-time depression detection and personalized support.
                </Typography>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <img
                    src={B1}
                    alt="Global depression statistics infographic"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "12px",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  />
                </Box>
              </Box>

              {/* Multimodal AI Solution */}
              <Box sx={{ my: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#1a3c5e",
                    mb: 2,
                    textTransform: "uppercase",
                  }}
                >
                  A Multimodal AI Solution
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    lineHeight: 2,
                    color: "#555",
                    mb: 3,
                    fontSize: "16px",
                  }}
                >
                  Our approach integrates facial emotion recognition, voice emotion analysis, text-based sentiment detection, and an AI-driven voice companion to provide a comprehensive framework for depression management. By combining these modalities, we achieve a holistic understanding of an individual s emotional state, enabling precise detection and adaptive interventions.
                </Typography>
              </Box>

              {/* Detailed Breakdown */}
              <Box sx={{ my: 4 }}>
                <Grid container spacing={3} sx={{ mb: 5 }}>
                  {[
                    {
                      title: "Facial Emotion Recognition",
                      desc: "Using EfficientNet and FaceNet-PyTorch, we analyze live facial expressions to classify emotions like happiness, sadness, and anger, mapped to the MADRS scale for depression severity assessment.",
                    },
                    {
                      title: "Voice Emotion Detection",
                      desc: "Voice inputs are processed with Librosa for MFCC extraction and analyzed using a CNN-LSTM model to detect emotional tone shifts, such as blunted affect or reduced speech rate.",
                    },
                    {
                      title: "Text-Based Sentiment Analysis",
                      desc: "Speech-to-text data is analyzed with VADER, TextBlob, and deep learning models LSTM, CNN to uncover emotional cues and long-term sentiment trends.",
                    },
                    {
                      title: "AI Voice Companion",
                      desc: "Powered by LLaMA 3.2 with LoRA, our voice companion delivers context-aware, personalized support based on real-time emotional data from all modalities.",
                    },
                  ].map((item, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card
                        sx={{
                          backgroundColor: "#fff",
                          p: 3,
                          borderRadius: "12px",
                          boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                          transition: "transform 0.3s",
                          "&:hover": { transform: "translateY(-5px)" },
                          height: "100%",
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "#1a3c5e",
                              mb: 2,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ lineHeight: 1.8, color: "#666" }}
                          >
                            {item.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Image Placeholder */}
              <Box sx={{ my: 4, textAlign: "center" }}>
                <img
                  src={B2}
                  alt="Illustration of AI analyzing voice, text, and facial data"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "12px",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                />
              </Box>

              {/* Depression Mapping */}
              <Box sx={{ my: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#1a3c5e",
                    mb: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Emotion-to-Depression Mapping
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    lineHeight: 2,
                    color: "#555",
                    mb: 3,
                    fontSize: "16px",
                  }}
                >
                  Our system employs an ensemble technique to fuse data from all modalities, calculating a depression score via weighted averaging. Mapped to the MADRS scale, severity levels are defined as:
                  <ul style={{ paddingLeft: "0", listStyle: "none", color: "#555" }}>
                    <li>Mild Depression: 0.5 compare 0.7</li>
                    <li>Moderate Depression: 0.7 compare 0.85</li>
                    <li>Severe Depression: Lesser 0.85</li>
                  </ul>
                  Weekly retraining with anonymized data ensures continuous improvement in accuracy.
                </Typography>
              </Box>

              {/* Security and Tools */}
              <Divider sx={{ my: 4 }} />
              <Box sx={{ my: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        backgroundColor: "#ffffff",
                        p: 3,
                        borderRadius: "12px",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s",
                        "&:hover": { transform: "translateY(-5px)" },
                        height: "100%",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#1a3c5e",
                            mb: 2,
                          }}
                        >
                          Data Security & Privacy
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            textAlign: "justify",
                            lineHeight: 1.9,
                            color: "#555",
                          }}
                        >
                          User privacy is paramount. We implement secure data transmission, local processing, and role-based access control RBAC to safeguard sensitive information, ensuring compliance with ethical standards.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        backgroundColor: "#ffffff",
                        p: 3,
                        borderRadius: "12px",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s",
                        "&:hover": { transform: "translateY(-5px)" },
                        height: "100%",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#1a3c5e",
                            mb: 2,
                          }}
                        >
                          Tools & Technologies
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            textAlign: "justify",
                            lineHeight: 1.9,
                            color: "#555",
                          }}
                        >
                          Our system leverages: TensorFlow/Keras for model training, Librosa for audio analysis, EfficientNet and FaceNet-PyTorch for facial recognition, VADER/TextBlob/NLTK for sentiment analysis, LLaMA 3.2 with LoRA for voice interaction, and MongoDB for data storage.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Conclusion */}
              <Divider sx={{ my: 4 }} />
              <Box sx={{ my: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#1a3c5e",
                    mb: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Conclusion
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    lineHeight: 2,
                    color: "#555",
                    mb: 4,
                    fontSize: "16px",
                  }}
                >
                  By harnessing advanced AI and deep learning, our multi modal system offers a scalable, accurate, and empathetic approach to depression detection and management. This research paves the way for a future where mental health support is accessible, proactive, and personalized transforming lives one interaction at a time.
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src={B3}
                    alt="Vision of accessible mental health care"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "12px",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Blog;