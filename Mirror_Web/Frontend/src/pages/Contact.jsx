import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Paper, 
  Grid, 
  IconButton,
  Avatar,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import Contacts from '../assets/contact.jpg';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form validation
    if (!formState.name || !formState.email || !formState.message) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formState);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Message sent successfully! We will get back to you soon.',
      severity: 'success'
    });
    
    // Reset form
    setFormState({ name: '', email: '', message: '' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon fontSize="large" />,
      title: 'Email',
      value: 'contact@healthcare.com',
      color: '#2196F3'
    },
    {
      icon: <PhoneIcon fontSize="large" />,
      title: 'Phone',
      value: '+94 112345678',
      color: '#4CAF50'
    },
    {
      icon: <LocationOnIcon fontSize="large" />,
      title: 'Location',
      value: 'Colombo, Sri Lanka',
      color: '#FF9800'
    }
  ];

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        background: "linear-gradient(135deg, rgba(243, 244, 246, 0.8), rgba(237, 242, 247, 0.9))",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 6,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative elements */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.2 }}
        sx={{ 
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #2196F3 0%, transparent 70%)",
          zIndex: 0,
          filter: "blur(50px)"
        }}
      />
      
      <Box 
        component={motion.div}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        sx={{ 
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #FF9800 0%, transparent 70%)",
          zIndex: 0,
          filter: "blur(40px)"
        }}
      />
      
      <Container maxWidth="lg" component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {/* Left side - Contact Info */}
          <Grid item xs={12} md={5}>
            <motion.div variants={itemVariants}>
              <Paper 
                elevation={6} 
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  borderRadius: 4,
                  background: "linear-gradient(to right bottom, #ffffff, #f8f9fa)",
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                {/* Decorative top gradient */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: '6px', 
                    background: 'linear-gradient(90deg, #2196F3, #21CBF3)'
                  }} 
                />
                
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography 
                    component={motion.h2}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    variant="h3" 
                    sx={{
                      fontSize: { xs: "28px", md: "34px" },
                      fontWeight: 700,
                      color: '#1a3c5e',
                      mb: 2
                    }}
                    gutterBottom
                  >
                    Get In Touch
                  </Typography>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20, 
                      delay: 0.4 
                    }}
                  >
                    <img
                      src={Contacts}
                      alt="Contact Illustration"
                      style={{ 
                        width: "100%", 
                        maxWidth: "250px", 
                        marginBottom: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                      }}
                    />
                  </motion.div>
                  
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Have questions or feedback? We're here to help!
                  </Typography>
                </Box>
                
                {/* Contact Information */}
                <Grid container spacing={3}>
                  {contactInfo.map((info, index) => (
                    <Grid item xs={12} key={index}>
                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 + (index * 0.2) }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Paper 
                          elevation={1} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 3, 
                            display: 'flex', 
                            alignItems: 'center',
                            ':hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: `${info.color}20`, 
                              color: info.color,
                              mr: 2
                            }}
                          >
                            {info.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              {info.title}
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {info.value}
                            </Typography>
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>
          
          {/* Right side - Contact Form */}
          <Grid item xs={12} md={7}>
            <motion.div variants={itemVariants}>
              <Paper 
                elevation={6} 
                sx={{ 
                  p: { xs: 3, md: 5 }, 
                  borderRadius: 4,
                  background: "linear-gradient(to right bottom, #ffffff, #f8f9fa)",
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <Typography 
                  variant="h4" 
                  component={motion.h4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  sx={{
                    fontWeight: 600,
                    mb: 4,
                    fontSize: { xs: "24px", md: "28px" },
                    color: '#1a3c5e',
                    textAlign: 'center'
                  }}
                >
                  Send Us A Message
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          variant="outlined"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              bgcolor: '#fff',
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(0,0,0,0.1)"
                            },
                            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2196F3"
                            }
                          }}
                          InputProps={{
                            sx: { py: 0.5 }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <TextField
                          fullWidth
                          label="Your Email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          variant="outlined"
                          required
                          type="email"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              bgcolor: '#fff',
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(0,0,0,0.1)"
                            },
                            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2196F3"
                            }
                          }}
                          InputProps={{
                            sx: { py: 0.5 }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <TextField
                          fullWidth
                          label="Your Message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          multiline
                          rows={6}
                          variant="outlined"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              bgcolor: '#fff',
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(0,0,0,0.1)"
                            },
                            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2196F3"
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          type="submit"
                          startIcon={<SendIcon />}
                          sx={{ 
                            mt: 1, 
                            py: 1.5,
                            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: 600,
                            boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                            '&:hover': { 
                              boxShadow: '0 6px 15px rgba(33, 150, 243, 0.4)'
                            }
                          }}
                        >
                          Send Message
                        </Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
