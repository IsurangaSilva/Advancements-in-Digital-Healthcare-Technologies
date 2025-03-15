import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Lakshitha from "../assets/lakshitha.png"
import Isuranga from "../assets/isuranga.png"
import Ravindu from "../assets/ravindu.png"
import Isuru from "../assets/isuru.jpg"
const About = () => {
  return (

    <div style={{ background: '#f0f4f8',height:"1000px"}}>
    <Box sx={{ textAlign: "center", padding: "50px" }}>
      <Typography variant="h2" sx={{ fontWeight: "bold", color: "#333", marginBottom: "40px" ,fontSize: "40px"}}>
        About Us
      </Typography>


      <Grid container spacing={4} justifyContent="center"fontSize="20px" marginTop={"50px"} padding= {"0px 50px"} >
        

      <Box sx={{ px: { xs: 2, md: 10 }, py: 5 ,padding:2}}>

  <Typography
    variant="body1"
    sx={{ textAlign: "justify", lineHeight: 1.8, mb: 3 }}
  >
   We are dedicated to advancing mental health care through innovative technology. With the increasing prevalence of mental health challenges, particularly depression, we recognize the urgent need for effective, accessible, and personalized solutions.
  </Typography>

  <Typography
    variant="body1"
    sx={{
      textAlign: "justify",
      lineHeight: 1.8,
      backgroundColor: "#f5f5f5",
      p: 3,
      borderRadius: "12px",
      mb: 3,
    }}
  >
    Our flagship innovation a **voice bot system** leverages **text, voice, and image analysis** 
    to detect, assess, and monitor depression. Powered by **deep learning** (hybrid CNN-LSTM architecture) 
    and **state-of-the-art NLP**, our system interprets real-time interactions, identifying emotional 
    patterns and adapting accordingly.
  </Typography>

  <Typography
    variant="body1"
    sx={{ textAlign: "justify", lineHeight: 1.8, mb: 3 }}
  >
    Beyond detection, our **AI-driven platform** provides **instant emotional support** and recommends 
    personalized interventions based on individual needs. With continuous **mood and behavior tracking**, 
    it ensures proactive, **non-invasive**, and **cost-effective** mental health assistance.
  

    Our mission is to make mental well-being a **priority for all** by eliminating barriers to care.  
    At **Sri Lanka Institute of Information Technology (SLIIT)**, we believe in a future where **technology empowers mental wellness**.
    </Typography>
</Box>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: "20px", textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <img src={Lakshitha} alt="Lakshitha" style={{ width: "200px", marginBottom: "20px" }} />
              <Typography variant="h6">Lakshitha</Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
               Team Member
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: "20px", textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <img src={Isuranga} alt="Our Vision" style={{ width: "200px", marginBottom: "20px" }} />
              <Typography variant="h6">Isuranga</Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
              Team Member
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: "20px", textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <img src={Ravindu} alt="Our Team" style={{ width: "200px", marginBottom: "20px" }} />
              <Typography variant="h6">Ravindu</Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
              Team Member 
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: "20px", textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <img src={Isuru} alt="Our Values" style={{ width: "200px", marginBottom: "20px" }} />
              <Typography variant="h6">Isuru</Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
              Team Member
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </div>
  );
};

export default About;