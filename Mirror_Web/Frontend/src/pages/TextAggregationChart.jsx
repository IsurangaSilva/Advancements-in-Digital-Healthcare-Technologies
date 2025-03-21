import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Card, CardContent, Typography, Grid,Box ,Container} from "@mui/material";
import { Padding } from "@mui/icons-material";

// Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const EmotionAggregationChart = ({ emotions }) => {
  const labels = emotions.map((item) => item.timestamp);

  // Emotion Scores Data
  const emotionLabels = ["anger", "fear", "joy", "neutral", "sadness", "surprise"];
  const emotionDatasets = emotionLabels.map((emotion, index) => ({
    label: emotion,
    data: emotions.map((item) => item.session_aggregate[emotion]),
    backgroundColor: [
      "rgba(255, 99, 132, 0.5)",  // anger - red
      "rgba(255, 159, 64, 0.5)",  // fear - orange
      "rgba(255, 205, 86, 0.5)",  // joy - yellow
      "rgba(75, 192, 192, 0.5)",  // neutral - teal
      "rgba(54, 162, 235, 0.5)",  // sadness - blue
      "rgba(153, 102, 255, 0.5)", // surprise - purple
    ][index],
    borderWidth: 1,
  }));

  // Emotion Scores Chart
  const emotionData = {
    labels,
    datasets: emotionDatasets,
  };

  // Common Chart Options
  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Emotion and Sentiment Analysis" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div
      style={{
        padding: "50px",
        paddingBottom:"0px"
      }}
    >
   <Grid container spacing={2}>
        
   <Grid item xs={10} sm={46} md={6}>
      <Card
        sx={{
          display: "inline-block",
          height: "100%",
          width: "100%",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e0e0e0",
          boxShadow: `0 4px 8px rgba(0, 0, 0, 0.05),`,
          transition: "all 0.3s ease-in-out",
          marginBottom:2
        }}
      >
        <CardContent>
          <Typography
            sx={{ fontSize: "17px", marginLeft: 2, margiTop: "20px" }}
          >
            Emotion Aggregation Scores (5min)
          </Typography>
          <Bar data={emotionData} options={commonOptions} />
        </CardContent>
      </Card>  
      </Grid>

      <Grid item xs={10} sm={46} md={6}>
      <Card
        sx={{
          display: "inline-block",
          height: "100%",
          width: "100%",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e0e0e0",
          boxShadow: `0 4px 8px rgba(0, 0, 0, 0.05),`,
          transition: "all 0.3s ease-in-out",
          marginBottom:2
        }}
      >
        <CardContent>
          <Typography
            sx={{ fontSize: "17px", marginLeft: 2, margiTop: "20px" }}
          >
            Emotion Aggregation Scores (1hour)
          </Typography>
          <Bar data={emotionData} options={commonOptions} />
        </CardContent>
      </Card>  
      </Grid>
      </Grid>
      
    </div>
  );
};

export default EmotionAggregationChart;
