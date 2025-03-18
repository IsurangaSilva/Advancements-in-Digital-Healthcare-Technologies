import React from "react";
import { Box, Card, CardContent, Grid, Typography, Container } from "@mui/material";
import Lakshitha from "../assets/lakshitha.png";
import Isuranga from "../assets/isuranga.png";
import Ravindu from "../assets/ravindu.png";
import Isuru from "../assets/isuru.jpg";

const About = () => {
  return (
    <div style={{background: "linear-gradient(to right, rgba(243, 232, 222, 0.5), rgba(231, 245, 247, 0.5))", minHeight: "100vh", paddingBottom: "50px" }}>
      <Box sx={{ textAlign: "center", padding: "60px 20px" }}>
        <Typography
          variant="h2"
          sx={{
            color: "black",
            marginBottom: "100px",
            marginLeft: "-30px",
            fontWeight: 600,
            fontSize: { xs: "32px", md: "40px" },
          }}
        >
          About Us
        </Typography>

        {/* Main Content */}
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#333", mb: 2 }}
              >
                Our Purpose
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", lineHeight: 1.9, color: "#555", mb: 4 }}
              >
                At the core of our work lies a deep commitment to transforming mental health care through cutting-edge technology. With mental health challenges, particularly depression, on the rise globally, we are driven by the urgent need to deliver innovative, accessible, and compassionate solutions. Our team, based at the Sri Lanka Institute of Information Technology SLIIT, combines expertise in artificial intelligence, psychology, and human-centered design to address these pressing issues.
              </Typography>

              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#333", mb: 2 }}
              >
                Our Innovation
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  lineHeight: 1.9,
                  backgroundColor: "#ffffff",
                  p: 3,
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  mb: 4,
                  color: "#555",
                }}
              >
                Our flagship product a sophisticated voice bot system integrates text, voice, and image analysis to detect, assess, and monitor depression with unparalleled precision. Powered by advanced deep learning techniques hybrid CNN-LSTM architecture and state of the art natural language processing NLP, this system analyzes real-time interactions to identify emotional patterns, offering personalized insights and support. Beyond detection, our AI-driven platform provides immediate emotional assistance, recommends tailored interventions, and tracks mood and behavioral trends over time ensuring a proactive, non-invasive, and cost-effective approach to mental health care.
              </Typography>

              {/* Vision and Mission */}
              <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      backgroundColor: "#1a3c5e",
                      color: "#fff",
                      p: 3,
                      borderRadius: "12px",
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Our Vision
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                      To create a world where mental well-being is universally prioritized, and advanced technology empowers every individual to lead a healthier, more fulfilling life—free from the stigma and barriers of traditional mental health care.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      backgroundColor: "#1a3c5e",
                      color: "#fff",
                      p: 3,
                      borderRadius: "12px",
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Our Mission
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                      To harness the power of artificial intelligence and interdisciplinary research to deliver scalable, empathetic, and effective mental health solutions, making support accessible to all while fostering a culture of understanding and resilience.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Small Container for Additional Info */}
              <Box
                sx={{
                  backgroundColor: "#e8eef3",
                  p: 3,
                  borderRadius: "12px",
                  textAlign: "center",
                  mb: 5,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1a3c5e", mb: 1 }}
                >
                  Why We Do This
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.7 }}>
                  Mental health affects millions worldwide, yet access to quality care remains limited. By bridging this gap with technology, we aim to empower individuals, support communities, and contribute to a healthier society—one conversation at a time.
                </Typography>
              </Box>
            </Box>

            {/* Team Section */}
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#333", mb: 4, textAlign: "center" }}
            >
              Meet Our Team
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {[
                { name: "Lakshitha", img: Lakshitha },
                { name: "Isuranga", img: Isuranga },
                { name: "Ravindu", img: Ravindu },
                { name: "Isuru", img: Isuru },
              ].map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "12px",
                      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent>
                      <img
                        src={member.img}
                        alt={member.name}
                        style={{
                          width: "180px",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginBottom: "20px",
                        }}
                      />
                      <Typography variant="h6" sx={{ color: "#1a3c5e" }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#777" }}>
                        Team Member
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default About;