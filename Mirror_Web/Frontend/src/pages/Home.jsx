import React from "react";
import { Grid, Typography, Button, TextField, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Image Imports
import H1 from "../assets/images/H1.jpg";
import H2 from "../assets/images/H2.png";
import H6 from "../assets/images/H6.jpg";
import H5 from "../assets/images/H5.png";

// Define color palette
const theme = {
  palette: {
    primary: "#000080", // Navy blue
    secondary: "#fcda98", // Yellow
    background: "#F5F5F5", // Light beige/white
    text: "#333333", // Dark gray
  },
};

// ---- Styled components ----
const Highlight = styled("span")(() => ({
  color: theme.palette.primary,
}));

const CtaButton = styled(Button)(() => ({
  backgroundColor: theme.palette.secondary,
  color: theme.palette.text,
  "&:hover": {
    backgroundColor: "#fcda98",
    border: "none",
  },
}));

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
    <HeroCard>
      <Grid container spacing={4} alignItems="center">
        {/* Left Column: Headings & Button */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
            Psychological & Behavioural Therapies <br />
            <Highlight>in the Heart of London</Highlight>
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Private and confidential counseling for adults, adolescents, and
            couples.
          </Typography>
          <CtaButton
            variant="contained"
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
          >
            Start Your Journey
          </CtaButton>
        </Grid>
        {/* Right Column: Hero Image */}
        <Grid item xs={12} md={6}>
          <img
            src={H1}
            alt="Therapist"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </Grid>
      </Grid>
    </HeroCard>
  </HeroSectionContainer>
);

// --- About Section ---
const AboutSection = () => (
  <Section bgColor="#ffffff">
    <ContentWrapper>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <img
            src={H6}
            alt="Therapist"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            PSYCHOLOGIST, COGNITIVE BEHAVIOURAL THERAPIST AND HIGH-PERFORMANCE
            COACH
          </Typography>
          <Typography variant="body1" gutterBottom>
            Based in London, offering face-to-face and online sessions.
          </Typography>
          <a href="/about">
            <CtaButton variant="contained">LEARN MORE</CtaButton>
          </a>
        </Grid>
      </Grid>
    </ContentWrapper>
  </Section>
);

// --- Feedback Section ---
const FeedbackSection = () => (
  <Section bgColor={theme.palette.background}>
    <ContentWrapper>
      <Grid container spacing={4} alignItems="center">
        {/* Main Feedback Card (Illustration + Form) */}
        <Grid item xs={12}>
          <FeedbackCard>
            <Grid container spacing={4} alignItems="center">
              {/* Illustration */}
              <Grid item xs={12} md={4}>
                <img
                  src={H2}
                  alt="Feedback Illustration"
                  style={{ width: "100%", borderRadius: "10px" }}
                />
              </Grid>
              {/* Feedback Form */}
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Give Us Your Valuable Feedback
                </Typography>

                <TextField
                  variant="outlined"
                  fullWidth
                  label="Name"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                />

                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  label="Feedback"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    marginBottom: "20px",
                  }}
                />

                <CtaButton variant="contained">Send Message</CtaButton>
              </Grid>
            </Grid>
          </FeedbackCard>
        </Grid>

        {/* Icons / Cards Section */}
        <Grid item xs={12} style={{ marginTop: "40px" }}>
          <Grid container spacing={2} justifyContent="center">
            {[
              { img: H5, text: "Get in touch and find\npeace in life" },
              { img: H5, text: "Improve your self-esteem\nand self-care" },
              { img: H5, text: "Enhance your mental\nhealth & wellbeing" },
              { img: H5, text: "Reduce your stress\n& anxiety" },
            ].map((item, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Card
                  elevation={3}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <img
                    src={item.img}
                    alt={`Icon ${index + 1}`}
                    style={{ width: "50px", height: "50px", marginBottom: 10 }}
                  />
                  <Typography
                    variant="body2"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {item.text}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </ContentWrapper>
    <br />
    <br />
    <br />
    <br />
  </Section>
);

// --- Home Component ---
const Home = () => {
  return (
    <div className="home">
      <HeroSection />
      <AboutSection />
      <FeedbackSection />
    </div>
  );
};

export default Home;