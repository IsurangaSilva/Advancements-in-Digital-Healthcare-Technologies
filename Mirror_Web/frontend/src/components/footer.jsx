import { Box, Typography, Grid, TextField, Button, Divider, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#2c3e50", color: "white", py: 5, px: { xs: 3, md: 10 }, mt: "auto" }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Branding & Newsletter */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            MIRROR
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
            Start your path to psychological wellness with our thoroughly selected specialists.
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your email"
              size="small"
              sx={{ bgcolor: "white", borderRadius: "5px" }}
            />
            <Button variant="contained" sx={{ bgcolor: "#4a90e2", "&:hover": { bgcolor: "#357ABD" } }}>
              Subscribe
            </Button>
          </Box>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={6} md={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Pages
          </Typography>
          {["Home", "About Us", "Blog", "Contact",  "Recommendations"].map((page, index) => (
            <Typography key={index} variant="body2" sx={{ opacity: 0.8, mb: 1, cursor: "pointer", "&:hover": { color: "#4a90e2" } }}>
              {page}
            </Typography>
          ))}
        </Grid>

        {/* Services */}
        <Grid item xs={6} md={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Services
          </Typography>
          {["Anxiety", "Relationships", "Eating Disorders", "Depression", "ADHD", "OCD", "Trauma"].map((service, index) => (
            <Typography key={index} variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              {service}
            </Typography>
          ))}
        </Grid>

        <Grid item xs={6} md={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Care Givers
          </Typography>
          {["Mark Hoffman", "Anne Middleton", "Whitney Pratt", "Jane Goodman", "Martha Ruz", "Kate Adams"].map((name, index) => (
            <Typography key={index} variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              {name}
            </Typography>
          ))}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, bgcolor: "#444" }} />

      {/* Footer Bottom Section */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          This is a Healthcare website - ©SLIIT 2025 - All Rights Reserved
        </Typography>
        <Box sx={{ mt: 2 }}>
          <IconButton href="#facebook" sx={{ color: "white", mx: 1, "&:hover": { color: "#1877F2" } }}>
            <Facebook />
          </IconButton>
          <IconButton href="#twitter" sx={{ color: "white", mx: 1, "&:hover": { color: "#1DA1F2" } }}>
            <Twitter />
          </IconButton>
          <IconButton href="#instagram" sx={{ color: "white", mx: 1, "&:hover": { color: "#C13584" } }}>
            <Instagram />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
