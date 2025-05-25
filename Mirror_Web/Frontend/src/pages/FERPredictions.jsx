import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FERPredictions = () => {
  const [fiveMinData, setFiveMinData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    // Fetch 5-minute aggregation data
    fetch("http://localhost:4000/api/fer/feremotions")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFiveMinData(data.emotions);
        }
      })
      .catch((error) =>
        console.error("Error fetching 5 min aggregations:", error)
      );

    // Fetch 60-minute aggregation data
    fetch("http://localhost:4000/api/fer/fer60emotions")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setHourlyData(data.emotions);
        }
      })
      .catch((error) =>
        console.error("Error fetching 60 min aggregations:", error)
      );
  }, []);

  // Define a color palette for each emotion
  const colorPalette = [
    "rgba(255, 99, 132, 1)", // Anger
    "rgba(54, 162, 235, 1)", // Fear
    "rgba(255, 206, 86, 1)", // Happy
    "rgba(75, 192, 192, 1)", // Neutral
    "rgba(153, 102, 255, 1)", // Sad
    "rgba(255, 159, 64, 1)", // Surprise
  ];

  // Sort data by timestamp ascending for consistent ordering
  const sortByTimestamp = (dataArray) => {
    return [...dataArray].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  };

  // Prepare data for line/bar charts
  const prepareLineOrBarData = (dataArray, isHourly = false) => {
    const sortedData = sortByTimestamp(dataArray);
    const labels = sortedData.map((item) => item.timestamp);
    const emotions = ["Anger", "Fear", "Happy", "Neutral", "Sad", "Surprise"];

    return {
      labels,
      datasets: emotions.map((emotion, index) => ({
        label: emotion,
        data: sortedData.map((item) => {
          // Check if this is hourly data (which uses session_aggregate) or 5-min data (which uses aggregated_emotions)
          const emotionsData = isHourly ? item.session_aggregate : item.aggregated_emotions;
          return emotionsData[emotion];
        }),
        borderColor: colorPalette[index],
        backgroundColor: colorPalette[index],
        fill: false,
        tension: 0.1, // For line chart smoothing
      })),
    };
  };

  // Retrieve the "last" record from 1-hour data
  const getLastHourlyEmotions = () => {
    if (!hourlyData.length) {
      return { Anger: 0, Fear: 0, Happy: 0, Neutral: 0, Sad: 0, Surprise: 0 };
    }
    const sorted = sortByTimestamp(hourlyData);
    return sorted[sorted.length - 1].session_aggregate;
  };

  // Retrieve the "overall" distribution from 5-minute data
  // (summing each emotion across all entries)
  const getOverallFiveMinEmotions = () => {
    if (!fiveMinData.length) {
      return { Anger: 0, Fear: 0, Happy: 0, Neutral: 0, Sad: 0, Surprise: 0 };
    }
    const sums = {
      Anger: 0,
      Fear: 0,
      Happy: 0,
      Neutral: 0,
      Sad: 0,
      Surprise: 0,
    };
    fiveMinData.forEach((item) => {
      sums.Anger += item.aggregated_emotions.Anger;
      sums.Fear += item.aggregated_emotions.Fear;
      sums.Happy += item.aggregated_emotions.Happy;
      sums.Neutral += item.aggregated_emotions.Neutral;
      sums.Sad += item.aggregated_emotions.Sad;
      sums.Surprise += item.aggregated_emotions.Surprise;
    });
    return sums;
  };
  // Prepare data for the line (5-min) and bar (1-hour) charts
  const fiveMinChartData = prepareLineOrBarData(fiveMinData, false);
  const hourlyChartData = prepareLineOrBarData(hourlyData, true);

  // Prepare data for pie charts
  const lastHourlyEmotions = getLastHourlyEmotions();
  const overallFiveMinEmotions = getOverallFiveMinEmotions();

  const pieChartLabels = [
    "Anger",
    "Fear",
    "Happy",
    "Neutral",
    "Sad",
    "Surprise",
  ];

  const lastHourlyPieData = {
    labels: pieChartLabels,
    datasets: [
      {
        label: "Last Emotion Predictions",
        data: [
          lastHourlyEmotions.Anger,
          lastHourlyEmotions.Fear,
          lastHourlyEmotions.Happy,
          lastHourlyEmotions.Neutral,
          lastHourlyEmotions.Sad,
          lastHourlyEmotions.Surprise,
        ],
        backgroundColor: colorPalette,
      },
    ],
  };

  const overallFiveMinPieData = {
    labels: pieChartLabels,
    datasets: [
      {
        label: "Overall Emotions",
        data: [
          overallFiveMinEmotions.Anger,
          overallFiveMinEmotions.Fear,
          overallFiveMinEmotions.Happy,
          overallFiveMinEmotions.Neutral,
          overallFiveMinEmotions.Sad,
          overallFiveMinEmotions.Surprise,
        ],
        backgroundColor: colorPalette,
      },
    ],
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "FER Emotions (5-Min Aggregations)",
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "FER Emotions (1-Hour Aggregations)",
      },
    },
  };

  const pieChartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: title,
      },
    },
  });

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        FER Predictions
      </Typography>

      {/* Row for Line (5-min) and Bar (1-hour) charts */}
      <Grid container spacing={4}>
        {/* 5-Min Aggregations (Line Chart) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>
              5-Min Aggregations
            </Typography>
            <Line data={fiveMinChartData} options={lineChartOptions} />
          </Paper>
        </Grid>

        {/* 1-Hour Aggregations (Bar Chart) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>
              1-Hour Aggregations
            </Typography>
            <Bar data={hourlyChartData} options={barChartOptions} />
          </Paper>
        </Grid>
      </Grid>

      {/* Row for Pie charts */}
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {/* Last Hourly Emotions (Pie Chart) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Pie
              data={lastHourlyPieData}
              options={pieChartOptions("Last Emotion Predictions")}
            />
          </Paper>
        </Grid>

        {/* Overall 5-Min Emotions (Pie Chart) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Pie
              data={overallFiveMinPieData}
              options={pieChartOptions("Overall Emotions")}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FERPredictions;
