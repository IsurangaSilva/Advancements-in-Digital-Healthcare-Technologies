import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Lakshitha from "../assets/lakshitha.png"
import Isuranga from "../assets/isuranga.png"
import Ravindu from "../assets/ravindu.png"
import Isuru from "../assets/isuru.jpg"
const About = () => {
  return (

    <div style={{ background: '#f0f4f8'}}>
    <Box sx={{ textAlign: "center", padding: "50px" }}>
      <Typography variant="h2" sx={{ fontWeight: "bold", color: "#333", marginBottom: "40px" ,fontSize: "40px"}}>
        About Us
      </Typography>


      <Grid container spacing={4} justifyContent="center"fontSize="20px" marginTop={"100px"} marginBottom={"300px"}>
        

      <p style={{ marginBottom: '80px' }}>We are dedicated to advancing mental health care through innovative technology. With the increasing prevalence of mental health challenges, particularly depression, we recognize the urgent need for effective, accessible, and personalized solutions. Our mission is to provide cutting-edge, AI-driven tools that empower individuals to manage their mental well-being.
Our flagship solution is a voice bot system designed to detect, assess, and monitor depression through advanced text, voice, and image interactions. Building on previous research, we’ve developed a more sophisticated and personalized approach to mental health care. By combining deep learning techniques, including a hybrid CNN-LSTM architecture, and state-of-the-art natural language processing (NLP), our system analyzes real-time user interactions to identify depressive symptoms and adapt to their emotional state.
Our AI-powered system not only offers immediate emotional support but also recommends personalized interventions based on the user’s needs. With its ability to continuously monitor and adjust to changes in mood and behavior, the system ensures ongoing support in a non-invasive, scalable, and cost-effective manner.
Through this innovative technology, we aim to break down barriers to mental health care, making it more accessible and personalized for everyone. At [Company Name], we are committed to improving mental health outcomes and creating a future where mental well-being is a priority for all.
</p>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: "20px", textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <img src={Lakshitha} alt="Lakshitha" style={{ width: "200px", marginBottom: "20px" }} />
              <Typography variant="h6">Lakshitha</Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Dedicated to improving mental health through innovative care.
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
                A world where everyone thrives with mental wellness.
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
                Experts committed to your journey to wellbeing.
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
                Compassion, integrity, and excellence in care.
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