import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Avatar, 
  Button, 
  Grid, 
  Paper, 
  Chip, 
  Divider,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Badge,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Zoom
} from '@mui/material';
import { 
  Edit, 
  Email, 
  Phone, 
  LocationOn, 
  UploadFile, 
  Cake, 
  Settings, 
  Favorite, 
  CheckCircle, 
  MoodBad, 
  Mood,
  InsertChart,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as LineChartIcon,
  CalendarToday,
  Notifications,
  EmojiEmotions,
  Psychology,
  ColorLens,
  AutoGraph
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart as RechartsPie, Pie, Cell, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart as RechartsLine, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadialBarChart, RadialBar } from 'recharts';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentView, setCurrentView] = useState('weekly');
  const [hoveredEmotion, setHoveredEmotion] = useState(null);

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    role: "Healthcare User",
    email: "alex.johnson@example.com",
    phone: "+94 71 234 5678",
    location: "Colombo, Sri Lanka",
    birthdate: "1990-06-15",
    bio: "Healthcare enthusiast with a keen interest in mental well-being and emotional intelligence. Regular user of emotion tracking applications.",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    memberSince: "January 2024"
  });

  // Mock emotional data
  const emotionData = [
    { name: 'Happy', value: 65, color: '#4CAF50', icon: '😊' },
    { name: 'Neutral', value: 15, color: '#2196F3', icon: '😐' },
    { name: 'Sad', value: 10, color: '#9C27B0', icon: '😢' },
    { name: 'Angry', value: 5, color: '#F44336', icon: '😠' },
    { name: 'Surprised', value: 5, color: '#FF9800', icon: '😲' },
  ];

  const weeklyData = [
    { day: 'Mon', happiness: 75, stress: 25 },
    { day: 'Tue', happiness: 60, stress: 40 },
    { day: 'Wed', happiness: 85, stress: 15 },
    { day: 'Thu', happiness: 50, stress: 50 },
    { day: 'Fri', happiness: 90, stress: 10 },
    { day: 'Sat', happiness: 95, stress: 5 },
    { day: 'Sun', happiness: 80, stress: 20 },
  ];

  const monthlyData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 70 },
    { month: 'Mar', score: 60 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 75 },
  ];

  const depressionRiskFactors = [
    { name: 'Sleep Quality', value: 70 },
    { name: 'Social Support', value: 85 },
    { name: 'Physical Activity', value: 60 },
    { name: 'Diet', value: 75 },
    { name: 'Stress Management', value: 65 }
  ];

  const activityLog = [
    { date: '2025-05-20', activity: 'Completed facial emotion analysis', result: 'Predominantly Happy', color: '#4CAF50' },
    { date: '2025-05-18', activity: 'Text-based emotion detection', result: 'Neutral with positive undertones', color: '#2196F3' },
    { date: '2025-05-15', activity: 'Voice pattern analysis', result: 'Stress detected - mild', color: '#FF9800' },
    { date: '2025-05-10', activity: 'Depression screening test', result: 'Low risk', color: '#4CAF50' },
    { date: '2025-05-05', activity: 'Weekly check-in submission', result: 'Complete', color: '#2196F3' },
  ];

  // New radial data
  const emotionRadarData = [
    { emotion: 'Joy', score: 85, fullMark: 100 },
    { emotion: 'Trust', score: 75, fullMark: 100 },
    { emotion: 'Fear', score: 30, fullMark: 100 },
    { emotion: 'Surprise', score: 60, fullMark: 100 },
    { emotion: 'Sadness', score: 20, fullMark: 100 },
    { emotion: 'Disgust', score: 15, fullMark: 100 },
    { emotion: 'Anger', score: 25, fullMark: 100 },
    { emotion: 'Anticipation', score: 70, fullMark: 100 },
  ];

  // New radial bar data
  const radialBarData = [
    { name: 'Self-Awareness', value: 85, fill: '#8884d8' },
    { name: 'Self-Regulation', value: 70, fill: '#83a6ed' },
    { name: 'Motivation', value: 90, fill: '#8dd1e1' },
    { name: 'Empathy', value: 75, fill: '#82ca9d' },
    { name: 'Social Skills', value: 80, fill: '#a4de6c' },
  ];

  // Animation for emotional pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * emotionData.length);
      setHoveredEmotion(emotionData[randomIndex].name);
      
      setTimeout(() => {
        setHoveredEmotion(null);
      }, 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setEditMode(false);
    // Here you would typically save the data to your backend
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  };

  const chartHoverAnimation = {
    scale: 1.05,
    transition: { duration: 0.3 }
  };

  // Custom animations
  const wavyAnimation = {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut"
    }
  };

  // Card entrance animations
  const cardEntrance = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15
      }
    }
  };

  // Custom styles
  const gradientBackground = {
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
  };

  const cardStyle = {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    height: '100%',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 48px rgba(37, 117, 252, 0.15)'
    },
    overflow: 'hidden'
  };

  // New gradient styles
  const gradientStyles = [
    {
      background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
      boxShadow: '0 15px 25px rgba(255, 154, 158, 0.4)'
    },
    {
      background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
      boxShadow: '0 15px 25px rgba(132, 250, 176, 0.4)'
    },
    {
      background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
      boxShadow: '0 15px 25px rgba(106, 17, 203, 0.4)'
    },
    {
      background: 'linear-gradient(to right, #f46b45 0%, #eea849 100%)',
      boxShadow: '0 15px 25px rgba(244, 107, 69, 0.4)'
    },
    {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 15px 25px rgba(102, 126, 234, 0.4)'
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        py: 5, 
        px: { xs: 2, md: 4 },
        backgroundColor: '#f8f9fd',
        background: 'linear-gradient(180deg, #f8f9fd 0%, #e8eaf6 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        component={motion.div}
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15, 
          ease: "easeInOut" 
        }}
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(106, 17, 203, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />

      <Box
        component={motion.div}
        animate={{ 
          opacity: [0.05, 0.08, 0.05],
          scale: [1, 1.1, 1],
          x: [0, 20, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 20, 
          ease: "easeInOut",
          delay: 5
        }}
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 117, 252, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Profile Header with gradient background */}
          <motion.div variants={fadeInUp}>
            <Paper 
              elevation={0}
              sx={{ 
                ...gradientBackground, 
                borderRadius: '20px', 
                p: { xs: 3, md: 5 }, 
                mb: 4, 
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative circles - enhanced with animations */}
              <Box 
                component={motion.div}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                sx={{ 
                position: 'absolute', 
                top: -30, 
                right: -30, 
                width: 150, 
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)'
              }} />
              
              <Box 
                component={motion.div}
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, 30, 0],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                sx={{ 
                position: 'absolute', 
                bottom: -40, 
                left: '30%', 
                width: 100, 
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)'
              }} />
              
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={2} sx={{ textAlign: { xs: 'center', md: 'left' }}}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton 
                        sx={{ 
                          bgcolor: '#2575fc',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#1a5cbf'
                          }
                        }}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    }
                  >
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: ['0 8px 24px rgba(0,0,0,0.2)', '0 12px 30px rgba(0,0,0,0.4)', '0 8px 24px rgba(0,0,0,0.2)']
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Avatar 
                        src={userData.profilePic}
                        sx={{ 
                          width: { xs: 120, md: 140 }, 
                          height: { xs: 120, md: 140 }, 
                          border: '4px solid white',
                        }}
                      />
                    </motion.div>
                  </Badge>
                </Grid>
                
                <Grid item xs={12} md={7}>
                  <Box>
                    {editMode ? (
                      <TextField
                        fullWidth
                        variant="filled"
                        name="name"
                        label="Name"
                        value={userData.name}
                        onChange={handleChange}
                        sx={{ 
                          mb: 1,
                          input: { color: 'white' },
                          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                          '& .MuiFilledInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.5)' }
                        }}
                      />
                    ) : (
                      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        {userData.name}
                      </Typography>
                    )}

                    {editMode ? (
                      <TextField
                        fullWidth
                        variant="filled"
                        name="role"
                        label="Role"
                        value={userData.role}
                        onChange={handleChange}
                        sx={{ 
                          mb: 1,
                          input: { color: 'white' },
                          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                          '& .MuiFilledInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.5)' }
                        }}
                      />
                    ) : (
                      <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.9 }}>
                        {userData.role}
                      </Typography>
                    )}

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ mr: 1, fontSize: 20 }} />
                          {editMode ? (
                            <TextField
                              fullWidth
                              variant="filled"
                              name="email"
                              label="Email"
                              value={userData.email}
                              onChange={handleChange}
                              size="small"
                              sx={{ 
                                input: { color: 'white' },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                '& .MuiFilledInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.5)' }
                              }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {userData.email}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ mr: 1, fontSize: 20 }} />
                          {editMode ? (
                            <TextField
                              fullWidth
                              variant="filled"
                              name="phone"
                              label="Phone"
                              value={userData.phone}
                              onChange={handleChange}
                              size="small"
                              sx={{ 
                                input: { color: 'white' },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                '& .MuiFilledInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.5)' }
                              }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {userData.phone}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                          {editMode ? (
                            <TextField
                              fullWidth
                              variant="filled"
                              name="location"
                              label="Location"
                              value={userData.location}
                              onChange={handleChange}
                              size="small"
                              sx={{ 
                                input: { color: 'white' },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                '& .MuiFilledInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.5)' }
                              }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {userData.location}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' }}}>
                  {editMode ? (
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outlined" 
                          onClick={toggleEditMode}
                          sx={{ 
                            borderColor: 'white', 
                            color: 'white',
                            '&:hover': {
                              borderColor: 'white',
                              backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="contained" 
                          onClick={handleSave}
                          sx={{ 
                            bgcolor: 'white',
                            color: '#6a11cb',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.9)'
                            }
                          }}
                        >
                          Save Changes
                        </Button>
                      </motion.div>
                    </Box>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="contained" 
                        startIcon={<Edit />}
                        onClick={toggleEditMode}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.3)'
                          }
                        }}
                      >
                        Edit Profile
                      </Button>
                    </motion.div>
                  )}
                  <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.8 }}>
                    Member since {userData.memberSince}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div variants={fadeInUp}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    minWidth: { xs: 'auto', sm: 0 },
                    p: { xs: 1, sm: 2 },
                    textTransform: 'none',
                    fontWeight: 500
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    background: 'linear-gradient(90deg, #6a11cb, #2575fc)'
                  }
                }}
              >
                <Tab 
                  icon={<InsertChart />} 
                  iconPosition="start" 
                  label="Overview"
                  sx={{
                    '&.Mui-selected': {
                      color: '#6a11cb',
                    }
                  }}
                />
                <Tab 
                  icon={<EmojiEmotions />} 
                  iconPosition="start" 
                  label="Emotion Tracking"
                  sx={{
                    '&.Mui-selected': {
                      color: '#6a11cb',
                    }
                  }}
                />
                <Tab 
                  icon={<CalendarToday />} 
                  iconPosition="start" 
                  label="Activity Log"
                  sx={{
                    '&.Mui-selected': {
                      color: '#6a11cb',
                    }
                  }}
                />
                <Tab 
                  icon={<Settings />} 
                  iconPosition="start" 
                  label="Settings"
                  sx={{
                    '&.Mui-selected': {
                      color: '#6a11cb',
                    }
                  }}
                />
              </Tabs>
            </Box>
          </motion.div>

          {/* Tab Content */}
          <Box>
            {/* Overview Tab */}
            {tabValue === 0 && (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={3}>
                  {/* Emotion Summary Card - Enhanced with animations */}
                  <Grid item xs={12} md={6} lg={4}>
                    <motion.div variants={cardEntrance}>
                      <Card sx={cardStyle}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                            <motion.div animate={pulseAnimation}>
                              <EmojiEmotions color="primary" sx={{ mr: 1 }} />
                            </motion.div>
                            Emotion Summary
                          </Typography>
                          
                          <Box sx={{ height: 240, mt: 2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPie>
                                <Pie
                                  data={emotionData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {emotionData.map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`}
                                      fill={entry.color}
                                      stroke={entry.color}
                                      strokeWidth={hoveredEmotion === entry.name ? 2 : 0}
                                      style={{
                                        filter: hoveredEmotion === entry.name ? 'drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.3))' : 'none',
                                        opacity: hoveredEmotion && hoveredEmotion !== entry.name ? 0.7 : 1,
                                        transition: 'all 0.3s'
                                      }}
                                    />
                                  ))}
                                </Pie>
                              </RechartsPie>
                            </ResponsiveContainer>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                            {emotionData.map((emotion, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.1, y: -5 }}
                                onMouseEnter={() => setHoveredEmotion(emotion.name)}
                                onMouseLeave={() => setHoveredEmotion(null)}
                              >
                                <Chip
                                  label={`${emotion.icon} ${emotion.name}`}
                                  sx={{ 
                                    bgcolor: emotion.color, 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    boxShadow: hoveredEmotion === emotion.name ? 
                                      '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
                                    transform: hoveredEmotion === emotion.name ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.3s'
                                  }}
                                />
                              </motion.div>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  {/* Emotional Intelligence Card - New */}
                  <Grid item xs={12} md={6} lg={8}>
                    <motion.div variants={cardEntrance}>
                      <Card sx={cardStyle}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                            <motion.div animate={pulseAnimation}>
                              <Psychology color="secondary" sx={{ mr: 1 }} />
                            </motion.div>
                            Emotional Intelligence Analysis
                          </Typography>
                          
                          <Box sx={{ height: 300, mt: 2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart outerRadius={90} width={730} height={300} data={emotionRadarData}>
                                <PolarGrid stroke="rgba(106, 17, 203, 0.2)" />
                                <PolarAngleAxis dataKey="emotion" tick={{ fill: '#666' }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                                <Radar 
                                  name="Emotional Profile" 
                                  dataKey="score" 
                                  stroke="#6a11cb" 
                                  fill="#6a11cb" 
                                  fillOpacity={0.5} 
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  {/* Weekly Mood Stats - Enhanced */}
                  <Grid item xs={12} md={8}>
                    <motion.div variants={cardEntrance} whileHover={chartHoverAnimation}>
                      <Paper 
                        elevation={2} 
                        sx={{
                          ...cardStyle,
                          p: 3,
                          background: 'linear-gradient(135deg, #f5f7ff 0%, #e8eaff 100%)',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" fontWeight="bold">
                            <AutoGraph sx={{ mr: 1, verticalAlign: 'middle', color: '#6a11cb' }} />
                            Mood Statistics
                          </Typography>
                          
                          <Box>
                            <Button
                              size="small"
                              onClick={() => handleViewChange('weekly')}
                              sx={{ 
                                mr: 1, 
                                bgcolor: currentView === 'weekly' ? 'primary.main' : 'transparent',
                                color: currentView === 'weekly' ? 'white' : 'primary.main',
                              }}
                            >
                              Weekly
                            </Button>
                            <Button
                              size="small"
                              onClick={() => handleViewChange('monthly')}
                              sx={{ 
                                bgcolor: currentView === 'monthly' ? 'primary.main' : 'transparent',
                                color: currentView === 'monthly' ? 'white' : 'primary.main',
                              }}
                            >
                              Monthly
                            </Button>
                          </Box>
                        </Box>
                        
                        <Box sx={{ height: 340 }}>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentView}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.4 }}
                              style={{ height: '100%' }}
                            >
                              {currentView === 'weekly' ? (
                                <ResponsiveContainer width="100%" height="100%">
                                  <RechartsBar data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <RechartsTooltip labelStyle={{ color: '#333' }} />
                                    <Legend />
                                    <Bar dataKey="happiness" name="Happiness" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="stress" name="Stress" fill="#F44336" radius={[4, 4, 0, 0]} />
                                  </RechartsBar>
                                </ResponsiveContainer>
                              ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                  <RechartsLine data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, 100]} />
                                    <RechartsTooltip labelStyle={{ color: '#333' }} />
                                    <Legend />
                                    <Line 
                                      type="monotone" 
                                      dataKey="score" 
                                      name="Emotional Score" 
                                      stroke="#6a11cb" 
                                      strokeWidth={3} 
                                      activeDot={{ r: 8 }}
                                    />
                                  </RechartsLine>
                                </ResponsiveContainer>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>

                  {/* New EI Components card */}
                  <Grid item xs={12} md={4}>
                    <motion.div variants={cardEntrance}>
                      <Paper 
                        elevation={2}
                        sx={{
                          ...cardStyle,
                          overflow: 'hidden',
                          p: 3,
                          background: 'linear-gradient(135deg, #f5f7ff 0%, #e8eaff 100%)',
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                          <ColorLens sx={{ mr: 1, verticalAlign: 'middle', color: '#6a11cb' }} />
                          EI Components
                        </Typography>

                        <Box sx={{ height: 340 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                              cx="50%" 
                              cy="50%" 
                              innerRadius="20%" 
                              outerRadius="80%" 
                              data={radialBarData} 
                              startAngle={180} 
                              endAngle={0}
                            >
                              <RadialBar
                                label={{ fill: '#666', position: 'insideStart' }}
                                background
                                dataKey='value'
                                cornerRadius={10}
                              />
                              <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
                            </RadialBarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>

                  {/* Health Metrics - Now with colorful gradients and improved animation */}
                  <Grid item xs={12}>
                    <motion.div variants={cardEntrance}>
                      <Paper elevation={2} sx={{ ...cardStyle, p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          <motion.div animate={pulseAnimation} style={{ display: 'inline-block' }}>
                            <Favorite sx={{ mr: 1, color: '#F44336', verticalAlign: 'middle' }} />
                          </motion.div>
                          Mental Health Metrics
                        </Typography>
                        
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          {depressionRiskFactors.map((factor, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                              <motion.div 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Card sx={{ 
                                  ...gradientStyles[index % gradientStyles.length], 
                                  color: 'white',
                                  borderRadius: '12px'
                                }}>
                                  <CardContent sx={{ py: 2 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                      {factor.name}
                                    </Typography>
                                    <Box sx={{ position: 'relative', mt: 1 }}>
                                      <LinearProgress
                                        variant="determinate"
                                        value={factor.value}
                                        sx={{
                                          height: 12,
                                          borderRadius: 3,
                                          backgroundColor: 'rgba(255,255,255,0.3)',
                                          '& .MuiLinearProgress-bar': {
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                          }
                                        }}
                                      />
                                      <Box 
                                        component={motion.div}
                                        animate={{
                                          boxShadow: ['0 0 0px rgba(255,255,255,0.5)', '0 0 10px rgba(255,255,255,0.9)', '0 0 0px rgba(255,255,255,0.5)']
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        sx={{ 
                                          position: 'absolute', 
                                          top: 0, 
                                          left: `calc(${factor.value}% - 12px)`,
                                          width: 12, 
                                          height: 12, 
                                          borderRadius: '50%', 
                                          backgroundColor: 'white', 
                                          transform: 'translateY(0px)'
                                        }} 
                                      />
                                      <Typography variant="body1" sx={{ textAlign: 'right', mt: 0.5 }} fontWeight="bold">
                                        {factor.value}%
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </motion.div>
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Emotion Tracking Tab */}
            {tabValue === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Card sx={cardStyle}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                          Emotional Health Progress
                        </Typography>
                        
                        <Box sx={{ height: 400 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLine
                              data={monthlyData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <RechartsTooltip labelStyle={{ color: '#333' }} />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#6a11cb" 
                                strokeWidth={3}
                                dot={{ r: 6 }}
                                activeDot={{ r: 8 }}
                              />
                            </RechartsLine>
                          </ResponsiveContainer>
                        </Box>
                          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', p: 3, bgcolor: 'rgba(106, 17, 203, 0.05)', borderRadius: 2 }}>
                          <PieChartIcon sx={{ fontSize: 40, color: '#6a11cb', mr: 2 }} />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Your emotional well-being has improved by 15% in the past month
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Continue using the emotion tracking features to maintain this positive trend.
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Emotional insights cards */}
                  <Grid item xs={12} md={4}>
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <Card sx={{ 
                        ...cardStyle, 
                        background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                        color: 'white'
                      }}>
                        <CardContent>
                          <Box sx={{ mb: 2 }}>
                            <Mood sx={{ fontSize: 40 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            Happiness Factor
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                            Your happiness indicators have increased significantly since your last assessment.
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              +23%
                            </Typography>
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              from last month
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <Card sx={{ 
                        ...cardStyle, 
                        background: 'linear-gradient(45deg, #2196F3 30%, #03A9F4 90%)',
                        color: 'white'
                      }}>
                        <CardContent>
                          <Box sx={{ mb: 2 }}>
                            <Favorite sx={{ fontSize: 40 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            Emotional Stability
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                            Your emotional responses are becoming more balanced and less volatile.
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              85%
                            </Typography>
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              stability score
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <Card sx={{ 
                        ...cardStyle, 
                        background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
                        color: 'white'
                      }}>
                        <CardContent>
                          <Box sx={{ mb: 2 }}>
                            <MoodBad sx={{ fontSize: 40 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            Stress Reduction
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                            Your stress levels have decreased steadily over the past two weeks.
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              -17%
                            </Typography>
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              from last month
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Activity Log Tab */}
            {tabValue === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={cardStyle}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Recent Activity
                    </Typography>
                    
                    {activityLog.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Box 
                          sx={{ 
                            p: 2, 
                            mb: 2, 
                            borderRadius: 2, 
                            bgcolor: 'background.default',
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 0 } }}>
                            <CalendarToday sx={{ fontSize: 20, color: 'primary.main', mr: 2 }} />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {activity.activity}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(activity.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Chip 
                            label={activity.result} 
                            size="small"
                            color={
                              activity.result.includes('Happy') || 
                              activity.result.includes('positive') || 
                              activity.result.includes('Low risk') 
                                ? 'success' 
                                : activity.result.includes('Neutral') 
                                  ? 'primary' 
                                  : activity.result.includes('Complete') 
                                    ? 'info'
                                    : 'warning'
                            }
                          />
                        </Box>
                      </motion.div>
                    ))}
                    
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outlined" color="primary">
                          View Complete History
                        </Button>
                      </motion.div>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Settings Tab */}
            {tabValue === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card sx={cardStyle}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                          Account Settings
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                            Email Notifications
                          </Typography>
                          <FormControl fullWidth>
                            <Select
                              value="weekly"
                              size="small"
                            >
                              <MenuItem value="daily">Daily Summary</MenuItem>
                              <MenuItem value="weekly">Weekly Summary</MenuItem>
                              <MenuItem value="none">No Emails</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                            Language
                          </Typography>
                          <FormControl fullWidth>
                            <Select
                              value="english"
                              size="small"
                            >
                              <MenuItem value="english">English</MenuItem>
                              <MenuItem value="spanish">Spanish</MenuItem>
                              <MenuItem value="french">French</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                            Privacy Level
                          </Typography>
                          <FormControl fullWidth>
                            <Select
                              value="private"
                              size="small"
                            >
                              <MenuItem value="public">Public Profile</MenuItem>
                              <MenuItem value="friends">Friends Only</MenuItem>
                              <MenuItem value="private">Private</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        
                        <Box sx={{ textAlign: 'right', mt: 4 }}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="contained" 
                              color="primary"
                            >
                              Save Preferences
                            </Button>
                          </motion.div>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={cardStyle}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                          Security Settings
                        </Typography>
                        
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                            Change Password
                          </Typography>
                          <TextField
                            fullWidth
                            type="password"
                            label="Current Password"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            type="password"
                            label="New Password"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            type="password"
                            label="Confirm New Password"
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                            Two-Factor Authentication
                          </Typography>
                          <FormControl fullWidth>
                            <Select
                              value="enabled"
                              size="small"
                            >
                              <MenuItem value="enabled">Enabled</MenuItem>
                              <MenuItem value="disabled">Disabled</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        
                        <Box sx={{ textAlign: 'right' }}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="contained" 
                              color="primary"
                            >
                              Update Security Settings
                            </Button>
                          </motion.div>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Profile;