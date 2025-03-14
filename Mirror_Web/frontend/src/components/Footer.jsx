import React from "react";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#000080",
        color: "white",
        padding: "50px 20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid
        container
        spacing={4}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {/* Logo & Description */}
        <Grid item xs={12} sm={6} md={4} style={{ textAlign: "left" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={Logo}
              alt="Logo Icon"
              style={{
                width: "50px",
                marginRight: "10px",
                borderRadius: "50%",
              }}
            />
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              MENTALCARE
            </Typography>
          </div>
          <Typography variant="body2" style={{ lineHeight: 1.5 }}>
            We are an experienced team of psychologists.
          </Typography>
        </Grid>

        {/* Pages Section */}
        <Grid item xs={12} sm={6} md={4} style={{ textAlign: "left" }}>
          <Typography variant="h6" style={{ marginBottom: "15px" }}>
            Pages
          </Typography>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { name: "Home", route: "/" },
              { name: "About Us", route: "/about" },
              { name: "Contact", route: "/contact" },
            ].map((page, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <Link
                  to={page.route}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#fcda98")}
                  onMouseOut={(e) => (e.target.style.color = "white")}
                >
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </Grid>

        {/* Services Section */}
        <Grid item xs={12} sm={6} md={4} style={{ textAlign: "left" }}>
          <Typography variant="h6" style={{ marginBottom: "15px" }}>
            Services
          </Typography>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { name: "Download", route: "/download" },
              { name: "Register", route: "/register" },
              { name: "Contact", route: "/contact" },
            ].map((service, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <Link
                  to={service.route}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#fcda98")}
                  onMouseOut={(e) => (e.target.style.color = "white")}
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>

      <Typography variant="body2" align="center" style={{ marginTop: "20px" }}>
        © 2023 MentalCare. All Rights Reserved.
      </Typography>
    </footer>
  );
};

export default Footer;
