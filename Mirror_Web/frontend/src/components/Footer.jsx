import React from "react";
import { Grid, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();

  return (
    <footer
      style={{
        backgroundColor: theme.palette.primary.main,
        color: "white",
        padding: "50px 20px",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="logo-icon.jpg"
              alt="Logo Icon"
              style={{ width: "50px", marginRight: "10px" }}
            />
            <Typography variant="h6">MENTALCARE</Typography>
          </div>
          <Typography variant="body2">
            We are an experienced team of psychologists.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6">Pages</Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "About Us",
              "Our Services",
              "Contact",
              "Shop",
              "Image Gallery",
            ].map((page, index) => (
              <li key={index}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  {page}
                </a>
              </li>
            ))}
          </ul>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6">Services</Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {["Relationship", "Depression", "Anxiety", "ADHD", "Stress"].map(
              (service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    {service}
                  </a>
                </li>
              )
            )}
          </ul>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6">Therapists</Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "Max Hoffmann",
              "Amy Peterson",
              "Lisa Anderson",
              "John Doe",
              "Katie Smith",
            ].map((therapist, index) => (
              <li key={index}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  {therapist}
                </a>
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <IconButton href="#" style={{ color: "white" }}>
          <Facebook />
        </IconButton>
        <IconButton href="#" style={{ color: "white" }}>
          <Twitter />
        </IconButton>
        <IconButton href="#" style={{ color: "white" }}>
          <Instagram />
        </IconButton>
        <IconButton href="#" style={{ color: "white" }}>
          <LinkedIn />
        </IconButton>
      </div>
      <Typography variant="body2" align="center" style={{ marginTop: "20px" }}>
        © 2023 MentalCare. All Rights Reserved.
      </Typography>
    </footer>
  );
};

export default Footer;
