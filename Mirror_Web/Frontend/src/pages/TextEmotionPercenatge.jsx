import React from "react";
import { Pie } from "react-chartjs-2";  // Import Pie chart from chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";
import { Card, CardContent, Typography,Grid } from "@mui/material";

// Register the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const TextEmotionPercenatge = ({ emotions, emotionCount }) => {
  if (Object.keys(emotions).length === 0) {
    return (
      <div>
        <Card sx={{ display: "inline-block", height: "100%", width: "100%", background: "white", borderRadius: "16px", border: "1px solid #e0e0e0", boxShadow: `0 4px 8px rgba(0, 0, 0, 0.05)`, transition: "all 0.3s ease-in-out", marginBottom: 2 }}>
          <CardContent>
            <Typography sx={{ fontSize: "17px", marginLeft: 2, marginTop: "20px" }}>
              No Emotion Data Available
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  const emotionLabels = ["anger", "fear", "joy", "neutral", "sadness", "surprise"];
  const emotionData = emotionLabels.map((emotion) => parseFloat(emotions[emotion] || 0)); 
  const emotionCountData = emotionLabels.map((emotion) => parseInt(emotionCount[emotion] || 0));
  
  const chartData = {
    labels: emotionLabels,
    datasets: [
      {
        label: "Emotion Percentages",
        data: emotionData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // anger - red
          "rgba(255, 159, 64, 0.6)", // fear - orange
          "rgba(255, 205, 86, 0.6)", // joy - yellow
          "rgba(75, 192, 192, 0.6)", // neutral - teal
          "rgba(54, 162, 235, 0.6)", // sadness - blue
          "rgba(153, 102, 255, 0.6)", // surprise - purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // anger - red
          "rgba(255, 159, 64, 1)", // fear - orange
          "rgba(255, 205, 86, 1)", // joy - yellow
          "rgba(75, 192, 192, 1)", // neutral - teal
          "rgba(54, 162, 235, 1)", // sadness - blue
          "rgba(153, 102, 255, 1)", // surprise - purple
        ],
        borderWidth: 1,
      },
    ],
  };

  const countChartData = {
    labels: emotionLabels,
    datasets: [
      {
        label: "Emotion Counts",
        data: emotionCountData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // anger - red
          "rgba(255, 159, 64, 0.6)", // fear - orange
          "rgba(255, 205, 86, 0.6)", // joy - yellow
          "rgba(75, 192, 192, 0.6)", // neutral - teal
          "rgba(54, 162, 235, 0.6)", // sadness - blue
          "rgba(153, 102, 255, 0.6)", // surprise - purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // anger - red
          "rgba(255, 159, 64, 1)", // fear - orange
          "rgba(255, 205, 86, 1)", // joy - yellow
          "rgba(75, 192, 192, 1)", // neutral - teal
          "rgba(54, 162, 235, 1)", // sadness - blue
          "rgba(153, 102, 255, 1)", // surprise - purple
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return context.label + ": " + value ;
          },
        },
      },
      title: {
        display: true,
        text: "Emotion Percentages",
      },
      datalabels: {
        color: "#fff",
        font: { size: 14, weight: "bold" },
        formatter: (value) => `${value}%`, 
      },
    },
  };
  

  return (
    <div style={{ padding: "20px 50px" }}> 
      <Grid container spacing={3}>

      <Grid item xs={10} sm={4} md={4}>
        <Card sx={{      
          display: "inline-block",
          height: "100%",
          width: "100%",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e0e0e0",
          boxShadow: `0 4px 8px rgba(0, 0, 0, 0.05)`,
          transition: "all 0.3s ease-in-out"  }}>
          <CardContent>
            <Typography sx={{ fontSize: "17px", marginLeft: 2, marginTop: "20px" }}>
              Last Emotion Percentages 
            </Typography>
            <Pie data={chartData} options={chartOptions} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4} md={4}>
        <Card sx={{      
          display: "inline-block",
          height: "100%",
          width: "100%",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e0e0e0",
          boxShadow: `0 4px 8px rgba(0, 0, 0, 0.05)`,
          transition: "all 0.3s ease-in-out"  }}>
          <CardContent>
            <Typography sx={{ fontSize: "17px", marginLeft: 2, marginTop: "20px" }}>
              Overall Emotion Percentages
            </Typography>
            <Pie data={chartData} options={chartOptions} />
          </CardContent>
        </Card>
      </Grid>


     
      <Grid item xs={12} sm={4} md={4}>
        <Card sx={{   
          display: "inline-block",
          height: "100%",
          width: "100%",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e0e0e0",
          boxShadow: `0 4px 8px rgba(0, 0, 0, 0.05)`,
          transition: "all 0.3s ease-in-out" }}>
          <CardContent>
            <Typography sx={{ fontSize: "17px", marginLeft: 2, marginTop: "20px" }}>
              Total Transcriptions
            </Typography>
            <Pie data={countChartData} options={chartOptions} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </div>
  );
};

export default TextEmotionPercenatge;
