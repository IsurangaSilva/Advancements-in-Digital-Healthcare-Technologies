import React from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
} from "@mui/material";

const Plans = () => {
  const pricingPlans = [
    {
      title: "Annual Subscription",
      price: "Rs.800",
      description: "Perfect for individuals seeking year-long mental health support.",
      features: ["Unlimited access", "Priority support", "Annual updates"],
      color: "#1a3c5e",
    },
    {
      title: "For Mental Health Hospitals",
      price: "Free",
      description: "Designed to empower hospitals with cutting-edge tools.",
      features: ["Full system access", "Staff training", "Data analytics"],
      color: "#2e7d32",
    },
    {
      title: "Monthly Subscription",
      price: "Rs.500",
      description: "Flexible option for short-term mental wellness needs.",
      features: ["Monthly access", "Basic support", "Mood tracking"],
      color: "#d81b60",
    },
    {
      title: "For Universities",
      price: "Rs.1500",
      description: "Tailored for academic institutions to support students.",
      features: ["Campus-wide access", "Research tools", "Custom reports"],
      color: "#0288d1",
    },
    {
      title: "Permanent Subscription",
      price: "Rs.2000",
      description: "One-time payment for lifetime mental health solutions.",
      features: ["Lifetime access", "Premium support", "All future updates"],
      color: "#f57c00",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(to right, rgba(243, 232, 222, 0.5), rgba(231, 245, 247, 0.5))",
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
          Our Pricing Plans
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
          Choose the plan that best fits your needs and start your journey toward better mental health today.
        </Typography>

        {/* Plans Grid */}
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: plan.color,
                        mb: 2,
                        textTransform: "uppercase",
                        fontSize: "22px",
                      }}
                    >
                      {plan.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "#333",
                        mb: 2,
                        fontSize: "32px",
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#777",
                        mb: 3,
                        lineHeight: 1.7,
                        fontSize: "15px",
                      }}
                    >
                      {plan.description}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {plan.features.map((feature, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{
                            color: "#555",
                            fontSize: "14px",
                            lineHeight: 1.8,
                          }}
                        >
                          • {feature}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <Box sx={{ pb: 4, textAlign: "center" }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: plan.color,
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "8px",
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: `${plan.color}cc`,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Plans;