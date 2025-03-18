// import React from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const EmotionChart = ({ emotions }) => {
//   const labels = emotions.map((item) => item.transcription);
//   const emotionLabels = ["anger", "fear", "joy", "neutral", "sadness", "surprise"];

//   // Extract emotion scores
//   const datasets = emotionLabels.map((emotion, index) => ({
//     label: emotion,
//     data: emotions.map((item) => item.emotionScores[emotion]),
//     backgroundColor: [
//       "rgba(255, 99, 132, 0.5)",  // anger - red
//       "rgba(255, 159, 64, 0.5)",  // fear - orange
//       "rgba(255, 205, 86, 0.5)",  // joy - yellow
//       "rgba(75, 192, 192, 0.5)",  // neutral - teal
//       "rgba(54, 162, 235, 0.5)",  // sadness - blue
//       "rgba(153, 102, 255, 0.5)", // surprise - purple
//     ][index],
//     borderWidth: 1,
//   }));

//   const data = { labels, datasets };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "Emotion Scores per Transcription" },
//     },
//     scales: {
//       y: { beginAtZero: true, max: 1 },
//     },
//   };

//   return <Bar data={data} options={options} />;
// };

// export default EmotionChart;
import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Card, CardContent, Typography, Grid,Box ,Container} from "@mui/material";
import { Padding } from "@mui/icons-material";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const EmotionChart = ({ emotions }) => {
  const labels = emotions.map((item) => item.timestamp);

  // Emotion Scores Data
  const emotionLabels = ["anger", "fear", "joy", "neutral", "sadness", "surprise"];
  const emotionDatasets = emotionLabels.map((emotion, index) => ({
    label: emotion,
    data: emotions.map((item) => item.emotionScores[emotion]),
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

  // VADER Compound Score Data
  const vaderDataset = {
    label: "VADER Compound Score",
    data: emotions.map((item) => item.vaderScore),
    backgroundColor: "rgba(255, 99, 132, 0.5)", // red
    borderColor: "rgba(255, 99, 132, 1)",
    borderWidth: 1,
  };

  // TextBlob Polarity Data
  const polarityDataset = {
    label: "TextBlob Polarity",
    data: emotions.map((item) => item.polarity),
    backgroundColor: "rgba(75, 192, 192, 0.5)", // teal
    borderColor: "rgba(75, 192, 192, 1)",
    borderWidth: 1,
  };

  // TextBlob Subjectivity Data
  const subjectivityDataset = {
    label: "TextBlob Subjectivity",
    data: emotions.map((item) => item.subjectivity),
    backgroundColor: "rgba(153, 102, 255, 0.5)", // purple
    borderColor: "rgba(153, 102, 255, 1)",
    borderWidth: 1,
  };

  // Emotion Scores Chart
  const emotionData = {
    labels,
    datasets: emotionDatasets,
  };

  // VADER Compound Score Chart
  const vaderData = {
    labels,
    datasets: [vaderDataset],
  };

  // TextBlob Polarity and Subjectivity Chart
  const textBlobData = {
    labels,
    datasets: [polarityDataset, subjectivityDataset],
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
        padding: "0px 50px",
      }}
    >
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
            VADER Compound Score
          </Typography>
          <Line data={vaderData} options={commonOptions} />
        </CardContent>
      </Card>
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
            TextBlob Polarity and Subjectivity
          </Typography>
          <Line data={textBlobData} options={commonOptions} />
        </CardContent>
      </Card>    
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
            Emotion Scores
          </Typography>
          <Bar data={emotionData} options={commonOptions} />
        </CardContent>
      </Card>      
    </div>
  );
};

export default EmotionChart;
