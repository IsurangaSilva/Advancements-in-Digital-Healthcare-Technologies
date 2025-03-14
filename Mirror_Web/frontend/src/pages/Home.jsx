import React from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Card,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Footer from "../components/Footer";
import H1 from "../assets/images/H1.jpg";
import H2 from "../assets/images/H2.png";
import H6 from "../assets/images/H6.jpg";
import H5 from "../assets/images/H5.png";

// Define color palette
const theme = {
  palette: {
    primary: "#003366", // Navy blue
    secondary: "#fcda98", // Yellow
    background: "#F5F5F5", // Light beige/white
    text: "#333333",      // Dark gray
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

/** 
 * A wrapper that limits content width to 1600px and centers it.
 */
const ContentWrapper = styled("div")(() => ({
  maxWidth: "1400px",
  width: "100%",
  margin: "0 auto",
}));

/**
 * A section that stretches full width for background color,
 * but centers content within ContentWrapper.
 */
const Section = styled("section")(
  ({ bgColor }) => ({
    width: "100%",
    backgroundColor: bgColor || "transparent",
    padding: "50px 20px",
  })
);

const Home = () => {
  // --- Hero Section (FULL WIDTH) ---
  const HeroSection = () => (
    <div
      style={{
        width: "100%",
        backgroundColor: theme.palette.background,
        padding: "50px 20px",
      }}
    >
      <Grid container spacing={4} alignItems="center" style={{ margin: 0 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h2" gutterBottom>
            PSYCHOLOGICAL & BEHAVIOURAL THERAPIES IN THE{" "}
            <Highlight>HEART OF LONDON</Highlight>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            We offer private and confidential counseling for adults, children, and
            families.
          </Typography>
          <CtaButton variant="contained">GET STARTED NOW</CtaButton>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src={H1}
            alt="Therapist"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </Grid>
      </Grid>
    </div>
  );

  // --- About Section (Constrained to 1600px) ---
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
            <CtaButton variant="contained">LEARN MORE</CtaButton>
          </Grid>
        </Grid>
      </ContentWrapper>
    </Section>
  );

  // --- Feedback Section (Constrained to 1600px) ---
  const FeedbackSection = () => (
    <Section bgColor={theme.palette.background}>
      <ContentWrapper>
        <Grid container spacing={4} alignItems="center">
          {/* Title */}
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              GIVE US YOUR VALUABLE FEEDBACK
            </Typography>
          </Grid>

          {/* Illustration & Feedback Form */}
          <Grid item xs={12} md={6}>
            <img
              src={H2}
              alt="Feedback Illustration"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              multiline
              rows={6}
              variant="outlined"
              fullWidth
              placeholder="Write your feedback..."
              style={{
                backgroundColor: "white",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            />
            <CtaButton variant="contained" fullWidth>
              SEND MESSAGE
            </CtaButton>
          </Grid>

          {/* Icons / Cards Section */}
          <Grid item xs={12} style={{ marginTop: "40px" }}>
            <Grid container spacing={2} justifyContent="center">
              {[
                {
                  img: H5,
                  text: "Get in touch and find peace in life",
                },
                {
                  img: H5,
                  text: "Improve your self-esteem and self-care",
                },
                {
                  img: H5,
                  text: "Enhance your mental health & wellbeing",
                },
                {
                  img: H5,
                  text: "Reduce your stress & anxiety",
                },
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
                    <Typography variant="body2">{item.text}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </ContentWrapper>
    </Section>
  );

  return (
    <div className="home">
      {/* 1) Full-width Hero */}
      <HeroSection />

      {/* 2) Constrained-width sections */}
      <AboutSection />
      <FeedbackSection />

      <Footer />
    </div>
  );
};

export default Home;
