// filepath: c:\Users\Isuranga\Desktop\PROJECT\Advancements-in-Digital-Healthcare-Technologies\Mirror_Web\Frontend\src\components\LoggedInHeader.jsx
import React, { useState, useEffect } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  MenuItem, 
  Button, 
  Menu, 
  IconButton,
  Avatar,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  Collapse
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoodIcon from '@mui/icons-material/Mood';
import PsychologyIcon from '@mui/icons-material/Psychology';
import RecommendIcon from '@mui/icons-material/Recommend';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import MicIcon from '@mui/icons-material/Mic';
import FaceIcon from '@mui/icons-material/Face';

const logoutHandler = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  window.localStorage.setItem("LoggedIn", false);
  window.location.href = "/";
};

const LoggedInHeader = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Update active link when location changes
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    const path = `/predictions/${option}`;
    setActiveLink(path);
    navigate(path);
    handleClose();
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const toggleMobileSubmenu = () => {
    setMobileSubmenuOpen(!mobileSubmenuOpen);
  };

  const navLinkVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 } 
    }
  };

  const logoVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const menuItemVariants = {
    initial: { opacity: 0, y: -5 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const isActive = (path) => {
    if (path === '/predictions') {
      return activeLink.startsWith('/predictions');
    }
    return activeLink === path;
  };

  // Mobile drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={Logo}
          alt="Mirror Logo"
          style={{ width: "40px", height: "40px", marginRight: "8px" }}
        />
        <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
          Mirror
        </Typography>
      </Box>
      <List>
        <ListItem 
          button 
          component={Link} 
          to="/" 
          selected={isActive('/')}
          sx={{
            backgroundColor: isActive('/') ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.05)' },
            borderRadius: '5px',
            mx: 1,
            mb: 1,
          }}
        >
          <ListItemIcon>
            <DashboardIcon color={isActive('/') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Dashboard" 
            primaryTypographyProps={{ 
              color: isActive('/') ? 'primary' : 'inherit',
              fontWeight: isActive('/') ? 'bold' : 'normal'
            }} 
          />
        </ListItem>

        <ListItem 
          button 
          onClick={toggleMobileSubmenu}
          selected={isActive('/predictions')}
          sx={{
            backgroundColor: isActive('/predictions') ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.05)' },
            borderRadius: '5px',
            mx: 1,
            mb: 1,
          }}
        >
          <ListItemIcon>
            <MoodIcon color={isActive('/predictions') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Emotion Predictions" 
            primaryTypographyProps={{ 
              color: isActive('/predictions') ? 'primary' : 'inherit',
              fontWeight: isActive('/predictions') ? 'bold' : 'normal'
            }} 
          />
          {mobileSubmenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        
        <Collapse in={mobileSubmenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              onClick={() => handleOptionClick('text')}
              selected={activeLink === '/predictions/text'}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <TextFieldsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Text" 
                primaryTypographyProps={{ 
                  color: activeLink === '/predictions/text' ? 'primary' : 'inherit',
                  fontSize: '0.9rem'
                }} 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => handleOptionClick('voice')}
              selected={activeLink === '/predictions/voice'}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <MicIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Voice" 
                primaryTypographyProps={{ 
                  color: activeLink === '/predictions/voice' ? 'primary' : 'inherit',
                  fontSize: '0.9rem'
                }} 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => handleOptionClick('fer')}
              selected={activeLink === '/predictions/fer'}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <FaceIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Face" 
                primaryTypographyProps={{ 
                  color: activeLink === '/predictions/fer' ? 'primary' : 'inherit',
                  fontSize: '0.9rem'
                }} 
              />
            </ListItem>
          </List>
        </Collapse>

        <ListItem 
          button 
          component={Link} 
          to="/depression" 
          selected={isActive('/depression')}
          sx={{
            backgroundColor: isActive('/depression') ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.05)' },
            borderRadius: '5px',
            mx: 1,
            mb: 1,
          }}
        >
          <ListItemIcon>
            <PsychologyIcon color={isActive('/depression') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Depression Prediction" 
            primaryTypographyProps={{ 
              color: isActive('/depression') ? 'primary' : 'inherit',
              fontWeight: isActive('/depression') ? 'bold' : 'normal'
            }} 
          />
        </ListItem>

        <ListItem 
          button 
          component={Link} 
          to="/recommendation" 
          selected={isActive('/recommendation')}
          sx={{
            backgroundColor: isActive('/recommendation') ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.05)' },
            borderRadius: '5px',
            mx: 1,
            mb: 1,
          }}
        >
          <ListItemIcon>
            <RecommendIcon color={isActive('/recommendation') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Recommendations" 
            primaryTypographyProps={{ 
              color: isActive('/recommendation') ? 'primary' : 'inherit',
              fontWeight: isActive('/recommendation') ? 'bold' : 'normal'
            }} 
          />
        </ListItem>

        <ListItem 
          button 
          component={Link} 
          to="/contact" 
          selected={isActive('/contact')}
          sx={{
            backgroundColor: isActive('/contact') ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.05)' },
            borderRadius: '5px',
            mx: 1,
            mb: 1,
          }}
        >
          <ListItemIcon>
            <ContactSupportIcon color={isActive('/contact') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Contact" 
            primaryTypographyProps={{ 
              color: isActive('/contact') ? 'primary' : 'inherit',
              fontWeight: isActive('/contact') ? 'bold' : 'normal'
            }} 
          />
        </ListItem>

        <ListItem 
          button 
          onClick={logoutHandler}
          sx={{
            backgroundColor: '#1E88E5',
            color: 'white',
            '&:hover': { backgroundColor: '#1976D2' },
            borderRadius: '5px',
            mx: 1,
            mt: 3,
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <AppBar
        position="sticky"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: "white",
          transition: "all 0.3s ease",
          boxShadow: scrolled 
            ? "0px 2px 10px rgba(0, 0, 0, 0.1)" 
            : "0px 2px 5px rgba(0, 0, 0, 0.05)",
          padding: scrolled ? "2px 0" : "5px 0",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "95%",
            margin: "0 auto",
            transition: "padding 0.3s ease",
          }}
        >
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
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
            </Link>
          </motion.div>

          {/* Mobile Menu */}
          {isMobile ? (
            <>
              <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <Tooltip title="Profile">
                  <IconButton component={Link} to="/profile">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#1E88E5' }}>
                      <AccountCircleIcon />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <IconButton 
                  edge="start" 
                  color="inherit" 
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ color: '#333' }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawerContent}
              </Drawer>
            </>
          ) : (
            <>
              {/* Desktop Navigation */}
              <Box sx={{ display: "flex", gap: "25px", alignItems: "center" }}>
                <motion.div
                  variants={navLinkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/"
                    style={
                      isActive("/")
                        ? { ...linkStyle, ...activeStyle }
                        : linkStyle
                    }
                  >
                    Dashboard
                  </Link>
                </motion.div>

                <motion.div
                  variants={navLinkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    aria-controls="predictions-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    style={
                      isActive("/predictions")
                        ? { ...linkStyle, ...activeStyle, cursor: 'pointer' }
                        : { ...linkStyle, cursor: 'pointer' }
                    }
                  >
                    Emotion Predictions
                    {isActive("/predictions") ? (
                      <ExpandLessIcon sx={{ ml: 0.5, fontSize: 16, verticalAlign: 'middle' }} />
                    ) : (
                      <ExpandMoreIcon sx={{ ml: 0.5, fontSize: 16, verticalAlign: 'middle' }} />
                    )}
                  </Link>
                </motion.div>

                {/* Dropdown Menu with Animation */}
                <Menu
                  id="predictions-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      overflow: 'visible',
                      borderRadius: '10px',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  TransitionComponent={motion.div}
                >
                  <AnimatePresence>
                    <motion.div
                      key="text"
                      variants={menuItemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <MenuItem onClick={() => handleOptionClick("text")} sx={menuItemStyle}>
                        <TextFieldsIcon fontSize="small" sx={{ mr: 1 }} />
                        Text
                      </MenuItem>
                    </motion.div>

                    <motion.div
                      key="voice"
                      variants={menuItemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ delay: 0.05 }}
                    >
                      <MenuItem onClick={() => handleOptionClick("voice")} sx={menuItemStyle}>
                        <MicIcon fontSize="small" sx={{ mr: 1 }} />
                        Voice
                      </MenuItem>
                    </motion.div>

                    <motion.div
                      key="face"
                      variants={menuItemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ delay: 0.1 }}
                    >
                      <MenuItem onClick={() => handleOptionClick("fer")} sx={menuItemStyle}>
                        <FaceIcon fontSize="small" sx={{ mr: 1 }} />
                        Face
                      </MenuItem>
                    </motion.div>
                  </AnimatePresence>
                </Menu>

                <motion.div
                  variants={navLinkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/depression"
                    style={
                      isActive("/depression")
                        ? { ...linkStyle, ...activeStyle }
                        : linkStyle
                    }
                  >
                    Depression Prediction
                  </Link>
                </motion.div>

                <motion.div
                  variants={navLinkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/recommendation"
                    style={
                      isActive("/recommendation")
                        ? { ...linkStyle, ...activeStyle }
                        : linkStyle
                    }
                  >
                    Recommendations
                  </Link>
                </motion.div>

                <motion.div
                  variants={navLinkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/contact"
                    style={
                      isActive("/contact")
                        ? { ...linkStyle, ...activeStyle }
                        : linkStyle
                    }
                  >
                    Contact
                  </Link>
                </motion.div>
              </Box>

              {/* Profile and Logout */}
              <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Tooltip title="Profile">
                    <IconButton component={Link} to="/profile">
                      <Avatar sx={{ width: 36, height: 36, bgcolor: '#1E88E5' }}>
                        <AccountCircleIcon />
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={logoutHandler}
                    startIcon={<LogoutIcon />}
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
                        boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    Logout
                  </Button>
                </motion.div>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

// Reusable link styles
const linkStyle = {
  textDecoration: "none",
  color: "#555",
  fontFamily: "Arial, sans-serif",
  fontSize: "15px",
  fontWeight: "500",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  padding: "6px 0",
};

const activeStyle = {
  color: "#1E88E5",
  fontWeight: "bold",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "2px",
    background: "#1E88E5",
  },
};

const menuItemStyle = {
  display: "flex", 
  alignItems: "center", 
  padding: "10px 20px",
  borderRadius: "5px",
  margin: "3px 8px",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(33, 150, 243, 0.1)", 
  }
};

export default LoggedInHeader;
