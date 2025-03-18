import React,{useState} from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Header = () => {

  const [activeLink, setActiveLink] = useState("/");

  const activeStyle = {
    textDecoration: "none", 
    color: "#1E88E5", 
    fontWeight: "bold",
    // borderBottom: "2px solid #1E88E5", 
    paddingBottom: "3px", 
    transition: "border-bottom 0.3s", 
  };
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

        {/* Navigation */}
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Link
            to="/"
            style={
              activeLink === "/" ? { ...linkStyle, ...activeStyle } : linkStyle
            }
            onClick={() => setActiveLink("/")}
          >
            Home
          </Link>
          <Link
            to="/blog"
            style={
              activeLink === "/blog"
                ? { ...linkStyle, ...activeStyle }
                : linkStyle
            }
            onClick={() => setActiveLink("/blog")}
          >
            Blog
          </Link>
          <Link
            to="/contact"
            style={
              activeLink === "/contact"
                ? { ...linkStyle, ...activeStyle }
                : linkStyle
            }
            onClick={() => setActiveLink("/contact")}
          >
            Contact
          </Link>
          <Link
            to="/about"
            style={
              activeLink === "/about"
                ? { ...linkStyle, ...activeStyle }
                : linkStyle
            }
            onClick={() => setActiveLink("/about")}
          >
            About Us
          </Link>
        </Box>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          {/* Login Button */}
          <a href="/login" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                color: "white",
                padding: "6px 15px",
                borderRadius: "25px",
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #2196F3 90%)",
                },
              }}
            >
              LOGIN
            </Button>
          </a>

          {/* Register Button */}
          <a href="/register" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #FFA726 30%, #FFCC80 90%)",

                color: "white",
                padding: "6px 15px",
                borderRadius: "25px",
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #FF7043 30%, #FFAB91 90%)",
                },
              }}
            >
              Get Started
            </Button>
          </a>
        </div>
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

export default Header;
