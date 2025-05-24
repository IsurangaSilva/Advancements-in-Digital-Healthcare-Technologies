import React, { useState, useEffect } from 'react';
import {
  Radar
} from 'react-chartjs-2';
// Import and register the parts of Chart.js we need
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const DepressionPredictions = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/depression/depressionprediction')
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
        } else {
          setPredictionData(result);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to fetch data.');
      });
  }, []);

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  if (!predictionData) {
    return <div style={{ textAlign: 'center' }}>Loading predictions...</div>;
  }

  // Prepare data for the radar chart
  const { averageDepressionScore, rating, averageEmotions } = predictionData;
  const radarData = {
    labels: ['Anger', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
    datasets: [
      {
        label: 'Average Emotions',
        data: [
          averageEmotions.Anger,
          averageEmotions.Fear,
          averageEmotions.Happy,
          averageEmotions.Neutral,
          averageEmotions.Sad,
          averageEmotions.Surprise
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
        borderColor: 'rgba(54, 162, 235, 1)',       // Blue border
        borderWidth: 2
      }
    ]
  };

  return (
    <div style={{ margin: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Depression Predictions
      </h1>

      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
        }}
      >
        <p>
          <strong>Average Depression Score:</strong>{' '}
          {averageDepressionScore.toFixed(2)}
        </p>
        <p>
          <strong>Depression Rating:</strong> {rating}
        </p>

        <div style={{ marginTop: '2rem' }}>
          <Radar data={radarData} />
        </div>
      </div>
    </div>
  );
};

export default DepressionPredictions;
