import React, { useEffect, useState } from "react";
import { 
  Grid, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  Box, 
  Container, 
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Paper 
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PsychologyIcon from "@mui/icons-material/Psychology";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InfoIcon from "@mui/icons-material/Info";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoodIcon from "@mui/icons-material/Mood";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";

// Animation imports
import { motion } from "framer-motion";
import CountUp from "react-countup";
import AOS from "aos";
import "aos/dist/aos.css";

// Image Imports
import H2 from "../assets/images/H2.png";
import H6 from "../assets/images/H6.jpg";
import H5 from "../assets/images/H5.png";
import H8 from "../assets/images/H8.jpg";

// Define color palette
const theme = {
  palette: {
    primary: "#000080", // Navy blue
    secondary: "#fcda98", // Yellow
    background: "#F5F5F5", // Light beige/white
    text: "#333333", // Dark gray
    accent: "#4A90E2", // Accent blue
    success: "#4CAF50", // Success green
    warning: "#FFC107", // Warning yellow
    error: "#FF5252", // Error red
    lightGray: "#EEEEEE", // Light gray for backgrounds
  },
};

// ---- Styled components ----
const Highlight = styled("span")(() => ({
  color: theme.palette.primary,
  fontWeight: 700,
}));

const CtaButton = styled(Button)(() => ({
  backgroundColor: theme.palette.secondary,
  color: theme.palette.text,
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: "30px",
  textTransform: "none",
  fontSize: "1rem",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#e8c781",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const AnimatedBox = styled(motion.div)({
  width: "100%",
});

const StatCard = styled(Paper)(({ color }) => ({
  padding: "24px",
  borderRadius: "12px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: color || "#fff",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
  },
}));

const ClientCard = styled(Card)({
  borderRadius: "12px",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
  },
});

// Hero Section Styled Components
const HeroSectionContainer = styled("section")(() => ({
  width: "100%",
  backgroundColor: theme.palette.background,
  display: "flex",
  justifyContent: "center",
  padding: "20px 20px",
}));

const HeroCard = styled("div")(() => ({
  backgroundColor: "#fff",
  borderRadius: "16px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "40px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}));

// Utility wrapper for other sections to constrain content width
const ContentWrapper = styled("div")(() => ({
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
}));

// Section component for background
const Section = styled("section")(({ bgColor }) => ({
  width: "100%",
  backgroundColor: bgColor || "transparent",
  padding: "50px 20px",
}));

// A card for the Feedback illustration & form
const FeedbackCard = styled(Card)(() => ({
  backgroundColor: "#fff",
  borderRadius: "16px",
  padding: "40px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}));

// --- Hero Section ---
const HeroSection = () => (
  <HeroSectionContainer>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <HeroCard>
        <Grid container spacing={4} alignItems="center">
          {/* Left Column: Hero Image */}
          <Grid item xs={12} md={6}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={H8}
                alt="Mental Well-being"
                style={{ width: "100%", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" }}
              />
            </motion.div>
          </Grid>

          {/* Right Column: Headings & Button */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Typography variant="h2" sx={{ fontWeight: 600, mb: 2 }} gutterBottom>
                Take Control of Your <Highlight>Mental Health</Highlight>
              </Typography>
              
              <Typography variant="h6" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}>
                AI-powered personalized therapy sessions tailored to your unique needs, helping you
                find clarity and balance in your mental health journey.
              </Typography>
              
              <Box display="flex" gap={2} mt={4}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <CtaButton
                    variant="contained"
                    endIcon={<ArrowForwardIosIcon />}
                    size="large"
                  >
                    View My Predictions
                  </CtaButton>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "30px",
                      borderColor: theme.palette.primary,
                      color: theme.palette.primary,
                      fontWeight: 600,
                      padding: "10px 24px",
                      "&:hover": {
                        borderColor: theme.palette.primary,
                        backgroundColor: "rgba(0, 0, 128, 0.04)",
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </motion.div>
              </Box>
              
              <Box display="flex" gap={3} mt={4}>
                {[
                  { value: "98%", label: "Success Rate" },
                  { value: "5,000+", label: "Clients Helped" },
                  { value: "24/7", label: "Support" }
                ].map((stat, index) => (
                  <Box key={index} textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      <CountUp end={parseInt(stat.value) || 100} duration={2.5} separator="," />
                      {isNaN(parseInt(stat.value)) && stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </HeroCard>
    </motion.div>
  </HeroSectionContainer>
);


// --- Depression Information Section ---
const DepressionInfoSection = () => (
  <Section bgColor="#fff">
    <Container maxWidth="lg">
      <Box textAlign="center" mb={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight="700" 
            gutterBottom
            sx={{ mb: 1 }}
          >
            Understanding <Highlight>Depression</Highlight>
          </Typography>
          <Divider sx={{ 
            width: "80px", 
            margin: "16px auto", 
            borderColor: theme.palette.primary, 
            borderWidth: "3px",
            borderRadius: "8px" 
          }} />
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "800px", mx: "auto", mb: 6 }}>
            Depression affects millions worldwide. Learn about symptoms, treatment options, and how our platform can help you track and improve your mental wellbeing.
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <AnimatedBox
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" fontWeight="600" gutterBottom sx={{ color: theme.palette.primary }}>
              Common Symptoms
            </Typography>
            <List>
              {[
                { text: "Persistent sad, anxious, or 'empty' mood", icon: <MoodIcon /> },
                { text: "Loss of interest in activities once enjoyed", icon: <HealthAndSafetyIcon /> },
                { text: "Decreased energy, fatigue", icon: <AccessTimeIcon /> },
                { text: "Difficulty concentrating, remembering, making decisions", icon: <PsychologyIcon /> },
                { text: "Insomnia, early-morning awakening, or excessive sleeping", icon: <AccessTimeIcon /> },
                { text: "Changes in appetite and/or weight", icon: <HealthAndSafetyIcon /> }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <ListItem>
                    <ListItemIcon sx={{ color: theme.palette.primary }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </motion.div>
              ))}
            </List>
            <Box mt={3}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <CtaButton
                  variant="contained"
                  endIcon={<ArrowForwardIosIcon />}
                >
                  Take Assessment
                </CtaButton>
              </motion.div>
            </Box>
          </AnimatedBox>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <img
              src={H6}
              alt="Depression Understanding"
              style={{ 
                width: "100%", 
                borderRadius: "16px", 
                boxShadow: "0 16px 32px rgba(0, 0, 128, 0.1)" 
              }}
            />
            <Box mt={4}>
              <Typography variant="h5" fontWeight="600" gutterBottom sx={{ color: theme.palette.primary }}>
                How Our Platform Helps
              </Typography>
              <Typography variant="body1" paragraph>
                Our AI-powered system analyzes voice patterns, speech content, and facial expressions to
                detect early signs of depression and anxiety, providing personalized recommendations and
                tracking your progress over time.
              </Typography>
              <Typography variant="body1">
                With continuous monitoring and professional supervision, we offer a comprehensive approach
                to mental health management that adapts to your unique needs and circumstances.
              </Typography>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  </Section>
);

// --- About Section ---
const AboutSection = () => (
  <Section bgColor={theme.palette.lightGray}>
    <ContentWrapper>
      <Box textAlign="center" mb={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Typography variant="h3" component="h2" fontWeight="700" gutterBottom>
            Our <Highlight>Professional Team</Highlight>
          </Typography>
          <Divider sx={{ 
            width: "80px", 
            margin: "16px auto", 
            borderColor: theme.palette.primary, 
            borderWidth: "3px",
            borderRadius: "8px" 
          }} />
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "800px", mx: "auto", mb: 6 }}>
            Expert psychologists, therapists and AI specialists working together to provide you with the best care
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src={H6}
              alt="Our Professional Team"
              style={{ 
                width: "100%", 
                borderRadius: "16px", 
                boxShadow: "0 16px 32px rgba(0, 0, 128, 0.1)" 
              }}
            />
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" fontWeight="700" gutterBottom color="primary">
              EXPERT PSYCHOLOGISTS, COGNITIVE BEHAVIOURAL THERAPISTS AND HIGH-PERFORMANCE COACHES
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              Our team consists of certified professionals with extensive experience in treating depression, anxiety, 
              and other mental health conditions. We combine traditional therapeutic approaches with cutting-edge 
              AI technology to deliver personalized treatment plans.
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {["CBT", "Mindfulness", "AI Analysis", "Voice Recognition", "Mood Tracking", "24/7 Support"].map((tag, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Chip 
                    label={tag} 
                    sx={{ 
                      bgcolor: theme.palette.secondary, 
                      color: theme.palette.text, 
                      fontWeight: 500,
                      my: 0.5
                    }} 
                  />
                </motion.div>
              ))}
            </Box>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <CtaButton
                variant="contained"
                endIcon={<ArrowForwardIosIcon />}
                href="/about"
              >
                Meet Our Team
              </CtaButton>
            </motion.div>
          </motion.div>
        </Grid>
      </Grid>
    </ContentWrapper>
  </Section>
);

// --- Client Stats Section ---
const ClientStatsSection = () => (
  <Section bgColor="#fff">
    <ContentWrapper>
      <Box textAlign="center" mb={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Typography variant="h3" component="h2" fontWeight="700" gutterBottom>
            Client <Highlight>Insights</Highlight>
          </Typography>
          <Divider sx={{ 
            width: "80px", 
            margin: "16px auto", 
            borderColor: theme.palette.primary, 
            borderWidth: "3px",
            borderRadius: "8px" 
          }} />
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "800px", mx: "auto", mb: 6 }}>
            Real-time data analytics and client progress monitoring
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={3} mb={6}>
        {[
          { 
            title: "Active Clients", 
            value: 1287, 
            icon: <PsychologyIcon fontSize="large" />, 
            color: "rgba(73, 138, 220, 0.1)",
            textColor: "#498ADC" 
          },
          { 
            title: "Recovery Rate", 
            value: 78, 
            icon: <TrendingUpIcon fontSize="large" />, 
            suffix: "%", 
            color: "rgba(76, 175, 80, 0.1)",
            textColor: "#4CAF50" 
          },
          { 
            title: "Daily Sessions", 
            value: 156, 
            icon: <AccessTimeIcon fontSize="large" />, 
            color: "rgba(255, 193, 7, 0.1)",
            textColor: "#FFC107" 
          },
          { 
            title: "Mood Improvement", 
            value: 63, 
            suffix: "%", 
            icon: <MoodIcon fontSize="large" />, 
            color: "rgba(233, 30, 99, 0.1)",
            textColor: "#E91E63" 
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <StatCard color={stat.color}>
                <Box color={stat.textColor} mb={1}>
                  {stat.icon}
                </Box>
                <Typography variant="h3" fontWeight="700" color={stat.textColor}>
                  <CountUp end={stat.value} duration={2.5} />
                  {stat.suffix}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.title}
                </Typography>
              </StatCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box mb={8}>
        <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 4 }} textAlign="center">
          <Highlight>Client Demographics and Recovery Data</Highlight>
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Paper elevation={3} sx={{ p: 3, borderRadius: "16px", height: "100%" }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Age Distribution
                </Typography>
                <Box height={300} display="flex" alignItems="flex-end" justifyContent="space-between" pt={4}>
                  {[
                    { ageGroup: "18-24", percentage: 28 },
                    { ageGroup: "25-34", percentage: 35 },
                    { ageGroup: "35-44", percentage: 20 },
                    { ageGroup: "45-54", percentage: 12 },
                    { ageGroup: "55+", percentage: 5 }
                  ].map((data, index) => (
                    <Box key={index} textAlign="center" width="18%">
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${data.percentage * 2}px` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        style={{ 
                          backgroundColor: theme.palette.primary,
                          borderRadius: "8px 8px 0 0",
                          width: "100%",
                          maxWidth: "40px",
                          margin: "0 auto"
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {data.ageGroup}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {data.percentage}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Paper elevation={3} sx={{ p: 3, borderRadius: "16px", height: "100%" }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Treatment Effectiveness
                </Typography>
                <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
                  {[
                    { condition: "Depression", effectiveness: 78 },
                    { condition: "Anxiety", effectiveness: 82 },
                    { condition: "PTSD", effectiveness: 71 },
                    { condition: "Bipolar Disorder", effectiveness: 65 }
                  ].map((data, index) => (
                    <Box key={index} mb={3}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body1">{data.condition}</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {data.effectiveness}%
                        </Typography>
                      </Box>
                      <Box sx={{ bgcolor: "rgba(0,0,0,0.05)", borderRadius: 5, height: 10 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${data.effectiveness}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.2, duration: 1 }}
                          style={{ 
                            height: "100%", 
                            borderRadius: 5, 
                            background: `linear-gradient(90deg, ${theme.palette.primary} 0%, ${theme.palette.accent} 100%)` 
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 4 }} textAlign="center">
          <Highlight>Client Success Stories</Highlight>
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              name: "Sarah J.",
              age: 34,
              condition: "Depression",
              improvement: "87%",
              duration: "6 months",
              testimonial: "The voice analysis technology detected patterns in my speech that indicated depression before I even recognized the symptoms myself. The early intervention made all the difference."
            },
            {
              name: "Michael T.",
              age: 42,
              condition: "Anxiety",
              improvement: "79%",
              duration: "4 months",
              testimonial: "Being able to track my anxiety levels daily through the app helped me identify triggers and develop better coping strategies. The therapist support was excellent."
            },
            {
              name: "Priya K.",
              age: 28,
              condition: "PTSD",
              improvement: "75%",
              duration: "8 months",
              testimonial: "The combination of AI monitoring and professional therapy has been life-changing. I've made progress I never thought possible after years of traditional therapy alone."
            }
          ].map((client, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <ClientCard>
                  <Box sx={{ p: 3, bgcolor: theme.palette.primary, color: "white" }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6" fontWeight="600">
                        {client.name}, {client.age}
                      </Typography>
                      <Chip 
                        label={client.condition} 
                        size="small" 
                        sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ p: 3, flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Improvement</Typography>
                        <Typography variant="h6" color="success.main" fontWeight="600">
                          {client.improvement}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Treatment</Typography>
                        <Typography variant="h6" fontWeight="600">
                          {client.duration}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: "italic", mt: 2 }}>
                      "{client.testimonial}"
                    </Typography>
                  </Box>
                </ClientCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ContentWrapper>
  </Section>
);

// --- Feedback Section ---
const FeedbackSection = () => (
  <Section bgColor={theme.palette.background}>
    <ContentWrapper>
      <Box textAlign="center" mb={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Typography variant="h3" component="h2" fontWeight="700" gutterBottom>
            Your <Highlight>Feedback</Highlight> Matters
          </Typography>
          <Divider sx={{ 
            width: "80px", 
            margin: "16px auto", 
            borderColor: theme.palette.primary, 
            borderWidth: "3px",
            borderRadius: "8px" 
          }} />
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "800px", mx: "auto", mb: 6 }}>
            Help us improve our services and provide better mental health support
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={4} alignItems="center">
        {/* Main Feedback Card (Illustration + Form) */}
        <Grid item xs={12}>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FeedbackCard>
              <Grid container spacing={4} alignItems="center">
                {/* Illustration */}
                <Grid item xs={12} md={4}>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                    <img
                      src={H2}
                      alt="Feedback Illustration"
                      style={{ width: "100%", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
                    />
                  </motion.div>
                </Grid>
                {/* Feedback Form */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" fontWeight="600" gutterBottom color="primary">
                    Share Your Experience
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                    Your feedback helps us improve our AI-powered mental health platform and provide 
                    better support for everyone facing depression and anxiety challenges.
                  </Typography>

                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Name"
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": {
                          borderColor: theme.palette.primary,
                        },
                      }
                    }}
                  />

                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Email"
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": {
                          borderColor: theme.palette.primary,
                        },
                      }
                    }}
                  />

                  <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    label="Your Feedback"
                    placeholder="Tell us about your experience with our platform..."
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": {
                          borderColor: theme.palette.primary,
                        },
                      }
                    }}
                  />

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <CtaButton 
                      variant="contained"
                      endIcon={<ArrowForwardIosIcon />}
                      fullWidth
                    >
                      Submit Feedback
                    </CtaButton>
                  </motion.div>
                </Grid>
              </Grid>
            </FeedbackCard>
          </motion.div>
        </Grid>

        {/* Services Cards Section */}
        <Grid item xs={12} style={{ marginTop: "60px" }}>
          <Typography variant="h4" fontWeight="600" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            Our <Highlight>Services</Highlight>
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              { 
                img: H5, 
                title: "Personalized Therapy", 
                text: "AI-powered sessions tailored specifically to your mental health needs and progress" 
              },
              { 
                img: H5, 
                title: "Continuous Monitoring", 
                text: "Real-time tracking of emotional patterns through voice and text analysis" 
              },
              { 
                img: H5, 
                title: "Progress Analytics", 
                text: "Detailed insights into your mental health journey with actionable recommendations" 
              },
              { 
                img: H5, 
                title: "Professional Support", 
                text: "Access to licensed therapists who work alongside our AI technology" 
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Card
                      elevation={4}
                      sx={{
                        textAlign: "center",
                        padding: "30px 20px",
                        borderRadius: "16px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                      }}
                    >
                      <Avatar
                        sx={{ 
                          width: 70, 
                          height: 70, 
                          bgcolor: "rgba(0, 0, 128, 0.1)",
                          mb: 2
                        }}
                      >
                        <img
                          src={item.img}
                          alt={`Icon ${index + 1}`}
                          style={{ width: "50%", height: "auto" }}
                        />
                      </Avatar>
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        gutterBottom
                        color="primary"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.text}
                      </Typography>
                    </Card>
                  </motion.div>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </ContentWrapper>
  </Section>
);

// --- Home Component ---
const Dashboard = () => {
  // Initialize AOS (Animate On Scroll) library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease',
    });
  }, []);

  return (
    <div className="home">
      <HeroSection />
      <DepressionInfoSection />
      <ClientStatsSection />
      <AboutSection />
      <FeedbackSection />
    </div>
  );
};

export default Dashboard;