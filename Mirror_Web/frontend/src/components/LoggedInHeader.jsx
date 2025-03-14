import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const LoggedInHeader = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        padding: "5px 0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "90%",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <a href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={Logo}
              alt="Mirror Logo"
              style={{ width: "45px", height: "45px", marginRight: "8px" }}
            />
            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
              Mirror
            </Typography>
          </Box>
        </a>

        {/* Navigation (Profile & Status) */}
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Link to="/profile" style={linkStyle}>
            Profile
          </Link>
          <Link to="/status" style={statusLinkStyle}>
            STATUS →
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Reusable link styles
const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: "16px",
  fontWeight: "500",
  transition: "color 0.3s",
};

const statusLinkStyle = {
  ...linkStyle,
  fontWeight: "bold",
  color: "green",
};

export default LoggedInHeader;
