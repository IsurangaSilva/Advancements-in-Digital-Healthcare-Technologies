import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, Button, Divider, IconButton, Container, Link } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn, YouTube, Email, Phone, LocationOn, ArrowUpward } from "@mui/icons-material";
import { motion, useAnimation } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const [scrollY, setScrollY] = useState(0);
  const waveControls = useAnimation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Animate waves based on scroll position
      waveControls.start({ 
        pathOffset: -0.05 * (window.scrollY / 1000),
        transition: { duration: 0.2 }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [waveControls]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Animation variants
  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const iconPulse = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.2, 1], 
      transition: { 
        repeat: Infinity, 
        repeatType: "reverse", 
        duration: 2,
      } 
    }
  };

  const iconHover = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.2, 
      rotate: 10, 
      transition: { duration: 0.2 } 
    }
  };

  const newsletterButtonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      backgroundColor: "#1976d2",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const scrollTopButtonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 1,
        duration: 0.5 
      }
    },
    hover: { 
      y: -5,
      transition: { 
        duration: 0.2,
        repeat: Infinity,
        repeatType: "reverse" 
      }
    }
  };

  const wavePathVariants = {
    initial: { pathLength: 0, pathOffset: 1 },
    animate: { 
      pathLength: 1, 
      pathOffset: 0,
      transition: { 
        duration: 2,
        ease: "easeInOut" 
      }
    }
  };

  // New floating effect for elements
  const floatEffect = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Enhanced button animation
  const enhancedButtonHover = {
    initial: { boxShadow: "0px 4px 12px rgba(100, 181, 246, 0.2)" },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 8px 20px rgba(100, 181, 246, 0.4)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <Box sx={{ 
      position: 'relative',
      mt: 'auto',
      overflow: 'hidden'
    }}>
      {/* Enhanced top wave decoration with multiple waves */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '80px',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <motion.svg
          viewBox="0 0 1440 100"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '120%', 
            height: '100%' 
          }}
          initial="initial"
          animate={waveControls}
        >
          <motion.path
            d="M0,0 C320,80 640,80 960,40 C1280,0 1440,40 1440,80 L1440,100 L0,100 Z"
            fill="rgba(44, 62, 80, 0.95)"
            variants={wavePathVariants}
          />
        </motion.svg>
        <motion.svg
          viewBox="0 0 1440 100"
          style={{ 
            position: 'absolute', 
            top: 20, 
            left: -50, 
            width: '120%', 
            height: '100%',
            opacity: 0.4
          }}
          initial="initial"
          animate={waveControls}
        >
          <motion.path
            d="M0,40 C280,10 620,90 960,50 C1280,10 1440,30 1440,60 L1440,100 L0,100 Z"
            fill="rgba(100, 181, 246, 0.4)"
            variants={wavePathVariants}
          />
        </motion.svg>
      </Box>

      {/* Main Footer Content */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          backgroundColor: "rgba(44, 62, 80, 0.95)", 
          backgroundImage: "linear-gradient(to right, #2c3e50, #1a2a3a)", 
          color: "white", 
          py: 7, 
          px: { xs: 3, md: 5 }, 
          mt: 'auto',
          position: 'relative',
          zIndex: 0,
          boxShadow: '0px -5px 25px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container>
          <Grid container spacing={4} justifyContent="center">
            {/* Branding & Newsletter */}
            <Grid item xs={12} md={4} component={motion.div} variants={fadeInUp}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  style={{ display: "inline-block", marginBottom: "16px" }}
                >
                  <Typography variant="h5" sx={{ 
                    fontWeight: "bold", 
                    mb: 1,
                    background: "linear-gradient(90deg, #64b5f6, #1976d2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    MIRROR
                  </Typography>
                </motion.div>
                <motion.div variants={floatEffect} animate="animate">
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.6 }}>
                    Empowering mental wellbeing through advanced emotion recognition technology.
                    Start your journey to better psychological wellness today.
                  </Typography>
                </motion.div>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                    <LocationOn sx={{ mr: 1, color: "#64b5f6" }} />
                  </motion.div>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    123 Healthcare Ave, Medical District, Colombo
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                    <Email sx={{ mr: 1, color: "#64b5f6" }} />
                  </motion.div>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    info@mirrorhealth.com
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                    <Phone sx={{ mr: 1, color: "#64b5f6" }} />
                  </motion.div>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    +94 112 345 6789
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} md={2}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#64b5f6" }}>
                  Pages
                </Typography>                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                  {[
                    { name: "Home", path: "/" },
                    { name: "About Us", path: "/about" },
                    { name: "Blog", path: "/blog" },
                    { name: "Contact", path: "/contact" },
                    { name: "Recommendations", path: "/recommendation" }
                  ].map((page, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                      <Link 
                        component={RouterLink} 
                        to={page.path} 
                        underline="none"
                        sx={{ 
                          color: "white", 
                          opacity: 0.8, 
                          display: "block",
                          mb: 1.5,
                          transition: "all 0.3s",
                          "&:hover": { 
                            opacity: 1, 
                            color: "#64b5f6",
                            transform: "translateX(5px)"
                          } 
                        }}
                      >
                        <motion.div whileHover={{ scale: 1.05, x: 5 }}>
                          {page.name}
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </Grid>

            {/* Services */}
            <Grid item xs={6} md={2}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#64b5f6" }}>
                  Services
                </Typography>
                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                  {["Emotion Analysis", "Text Recognition", "Voice Analysis", "Facial Recognition", "Depression Detection", "Mental Health Tips", "Personalized Care"].map((service, index) => (
                    <motion.div key={index} variants={fadeInUp}>                      <motion.div whileHover={{ scale: 1.05, x: 5 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            opacity: 0.8, 
                            mb: 1.5,
                            transition: "all 0.3s",
                            "&:hover": { 
                              opacity: 1, 
                              color: "#64b5f6"
                            } 
                          }}
                        >
                          {service}
                        </Typography>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={4}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#64b5f6" }}>
                  Join Our Newsletter
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, lineHeight: 1.6 }}>
                  Subscribe to our newsletter to receive the latest updates, mental health tips, and special offers.
                </Typography>
                
                <Box 
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  sx={{ 
                    display: "flex", 
                    gap: 1,
                    flexDirection: { xs: "column", sm: "row" }
                  }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} style={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter your email"
                      size="small"
                      sx={{ 
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderRadius: "5px",
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255,255,255,0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255,255,255,0.5)",
                          },
                        }
                      }}
                      InputProps={{
                        sx: { color: "white" }
                      }}
                    />
                  </motion.div>
                  <motion.div
                    variants={enhancedButtonHover}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="contained" 
                      sx={{ 
                        bgcolor: "#64b5f6",
                        px: 3,
                        height: "100%",
                        whiteSpace: "nowrap",
                        background: "linear-gradient(45deg, #64b5f6 30%, #1976d2 90%)",
                      }}
                    >
                      Subscribe
                    </Button>
                  </motion.div>
                </Box>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                    Follow us on social media
                  </Typography>
                  <Box 
                    component={motion.div} 
                    variants={staggerContainer} 
                    initial="initial"
                    animate="animate"
                    sx={{ display: "flex", gap: 1 }}
                  >
                    {[
                      { icon: <Facebook />, color: "#1877F2", delay: 0.1 },
                      { icon: <Twitter />, color: "#1DA1F2", delay: 0.2 },
                      { icon: <Instagram />, color: "#C13584", delay: 0.3 },
                      { icon: <LinkedIn />, color: "#0077b5", delay: 0.4 },
                      { icon: <YouTube />, color: "#FF0000", delay: 0.5 }
                    ].map((social, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: social.delay + 0.7 }}
                        whileHover="hover"
                        variants={iconHover}
                      >
                        <IconButton 
                          sx={{ 
                            color: "rgba(255,255,255,0.7)", 
                            backgroundColor: "rgba(255,255,255,0.1)",
                            transition: "all 0.3s",
                            "&:hover": { 
                              color: social.color, 
                              backgroundColor: "rgba(255,255,255,0.2)" 
                            }
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Divider sx={{ my: 4, bgcolor: "rgba(255,255,255,0.1)" }} />
          </motion.div>

          {/* Footer Bottom Section */}
          <Box sx={{ 
            textAlign: "center",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Typography variant="body2" sx={{ opacity: 0.7, mb: { xs: 2, md: 0 } }}>
                © {new Date().getFullYear()} Mirror Health - Advanced Healthcare Technologies - All Rights Reserved
              </Typography>
            </motion.div>
            
            <motion.div
              variants={scrollTopButtonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              onClick={scrollToTop}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Button 
                startIcon={<ArrowUpward />}
                variant="contained"
                size="small"
                sx={{ 
                  borderRadius: "50%", 
                  minWidth: "40px", 
                  width: "40px", 
                  height: "40px", 
                  padding: 0,
                  bgcolor: "#64b5f6",
                  background: "linear-gradient(45deg, #64b5f6 30%, #1976d2 90%)",
                  "&:hover": { bgcolor: "#1976d2" }
                }}
              />
            </motion.div>
          </Box>
        </Container>
      </Box>
      
      {/* Enhanced animated glow effects */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          x: [0, -10, 0],
          transition: { 
            repeat: Infinity,
            duration: 5
          }
        }}
        sx={{ 
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #64b5f6 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          y: [0, -15, 0],
          transition: { 
            repeat: Infinity,
            duration: 6,
            delay: 1.5
          }
        }}
        sx={{ 
          position: 'absolute',
          top: '30%',
          left: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #2196F3 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 0
        }}
      />
      
      {/* New glow effect */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.1, 1],
          transition: { 
            repeat: Infinity,
            duration: 7,
            delay: 0.5
          }
        }}
        sx={{ 
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #9c27b0 0%, transparent 70%)',
          filter: 'blur(35px)',
          zIndex: 0
        }}
      />
    </Box>
  );
};

export default Footer;
