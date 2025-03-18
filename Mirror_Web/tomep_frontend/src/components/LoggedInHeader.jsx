import React from "react";
import { AppBar, Toolbar, Typography, Box,MenuItem } from "@mui/material";
import { Link,useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import AccountCircle from "@mui/icons-material/AccountCircle";


const logoutHandler = () => {
  console.log("Hello")
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  window.localStorage.setItem("LoggedIn", false);
  window.location.href = "/";
};

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

        <Box sx={{ display: "flex", gap: "20px" }}>
          <Link to="/" style={linkStyle}>
            Predctions
          </Link>
          <Link to="/" style={linkStyle}>
            Recommendations
          </Link>
          <Link to="/contact" style={linkStyle}>
            Contact
          </Link>
          <Link to="/about" style={linkStyle}>
            About Us
          </Link>
        </Box>

        {/* Navigation (Profile & Status) */}
        <Box sx={{ display: "flex", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link to="/profile" style={linkStyle}>
              <AccountCircle
                style={{
                  marginRight: 5,
                  backgroundColour: "black",
                  color: "black",
                  fontSize: "28px",
                }}
              />
            </Link>
          </div>
          <MenuItem
            onClick={logoutHandler}
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
              padding: "8px 20px",
              borderRadius: "25px",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #2196F3 90%)",
              },
            }}
          >
            Logout
          </MenuItem>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Reusable link styles
const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  fontWeight: "500",
  transition: "color 0.3s",
};

const statusLinkStyle = {
  ...linkStyle,
  fontWeight: "bold",
  color: "green",
};

export default LoggedInHeader;
