// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import EmotionAggregationChart from "./VoiceAggregationChart";
// // import EmotionPercentageChart from "./VoiceEmotionPercenatge";

// // const VoicePrediction = () => {
// //   const [aggreagationsHourly, setAggreagationsHourly] = useState([]);
// //   const [emotionsPercentage, setEmotionsPercentage] = useState({});
// //   const [emotionsCount, setEmotionsCount] = useState({});
// //   const [lastEmotion, setLastEmotion] = useState({});
// //   const [aggreagations, setAggreagations] = useState([]);
// //   const [latestCharts, setLatestCharts] = useState({
// //     mfcc: null,
// //     waveform: null,
// //     spectrogram: null,
// //     emotion_distribution: null
// //   });

// //   useEffect(() => {
// //     axios.get("http://localhost:4000/api/voice/voiceaggregateemotions")
// //       .then((response) => {
// //         setAggreagations(response.data.emotions)
// //         setAggreagationsHourly(response.data.emotionshourly)
// //         console.log("res",response.data.emotionshourly)
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching emotions:", error);
// //       });
// //   }, []);

// //   useEffect(() => {
// //     axios.get("http://localhost:4000/api/voice/voiceemotionsprecentage")
// //       .then((response) => {
// //         const percentages = response.data.percentages;
// //         const counts = response.data.counts;
// //         const lastpercentage = response.data.emotionLastPercentages;
// //         const formattedPercentages = Object.fromEntries(
// //           Object.entries(percentages).map(([emotion, value]) => [
// //             emotion,
// //             parseFloat(value)
// //           ])
// //         );
// //         const formattedLastPercentages = Object.fromEntries(
// //           Object.entries(lastpercentage).map(([emotion, value]) => [
// //             emotion,
// //             parseFloat(value)
// //           ])
// //         );
// //         const formattedCounts = Object.fromEntries(
// //           Object.entries(counts).map(([emotion, value]) => [
// //             emotion,
// //             parseFloat(value)
// //           ])
// //         );
// //         setEmotionsPercentage(formattedPercentages);
// //         setEmotionsCount(formattedCounts);
// //         setLastEmotion(formattedLastPercentages)
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching emotions percentages:", error);
// //       });
// //   }, []);

// //   useEffect(() => {
// //     if (Object.keys(emotionsPercentage).length > 0) {
// //       console.log("Emotion Percentages state:", emotionsPercentage);
// //     }
// //   }, [emotionsPercentage]);

// //   useEffect(() => {
// //     if (Object.keys(emotionsCount).length > 0) {
// //       console.log("Emotion Counts state:", emotionsCount);
// //     }
// //   }, [emotionsCount]);
// //   useEffect(() => {
// //     if (Object.keys(lastEmotion).length > 0) {
// //       console.log("Emotion Counts state:", lastEmotion);
// //     }
// //   }, [lastEmotion]);

// //  // Load latest charts from public/assets
// //     const loadLatestCharts = () => {
// //       const timestamp = Date.now(); // Cache busting
// //       setLatestCharts({
// //         mfcc: `/assets/latest_mfcc.png`,
// //         waveform: `/assets/latest_waveform.png`,
// //         spectrogram: `/assets/latest_spectrogram.png`,
// //         emotion_distribution: `/assets/latest_emotion_distribution.png`
// //       });
// //     };

// //     loadLatestCharts();

// //   return (
// //     <div>
// //       {aggreagations.length > 0 && (
// //         <EmotionAggregationChart
// //           emotions={aggreagations}
// //           emotionsHourly={aggreagationsHourly}
// //         />
// //       )}
// //       {Object.keys(emotionsPercentage).length > 0 &&
// //         Object.keys(emotionsCount).length > 0 && Object.keys(emotionsCount).length > 0 && Object.keys(lastEmotion).length > 0 && (
// //           <EmotionPercentageChart
// //             emotions={emotionsPercentage}
// //             emotionCount={emotionsCount}
// //             lastEmotion={lastEmotion}
// //           />
// //         )}
// //       {/* {emotions.length > 0 && <EmotionChart emotions={emotions} />} */}

// //       {/* Audio visualization section */}
// //       <div className="audio-visualizations">
// //         <h2>Latest Audio Analysis</h2>

// //         <div className="visualization-grid">
// //           <div className="chart-container">
// //             <h3>Audio Waveform</h3>
// //             <img
// //               src={latestCharts.waveform}
// //               alt="Audio Waveform"
// //               className="audio-chart"
// //               onError={(e) => {
// //                 e.target.style.display = 'none';
// //                 console.log('Waveform image not found');
// //               }}
// //             />
// //           </div>

// //           <div className="chart-container">
// //             <h3>MFCC Features</h3>
// //             <img
// //               src={latestCharts.mfcc}
// //               alt="MFCC Features"
// //               className="audio-chart"
// //               onError={(e) => {
// //                 e.target.style.display = 'none';
// //                 console.log('MFCC image not found');
// //               }}
// //             />
// //           </div>

// //           <div className="chart-container">
// //             <h3>Spectrogram</h3>
// //             <img
// //               src={latestCharts.spectrogram}
// //               alt="Spectrogram"
// //               className="audio-chart"
// //               onError={(e) => {
// //                 e.target.style.display = 'none';
// //                 console.log('Spectrogram image not found');
// //               }}
// //             />
// //           </div>

// //           <div className="chart-container">
// //             <h3>Emotion Distribution</h3>
// //             <img
// //               src={latestCharts.emotion_distribution}
// //               alt="Emotion Distribution"
// //               className="audio-chart"
// //               onError={(e) => {
// //                 e.target.style.display = 'none';
// //                 console.log('Emotion distribution image not found');
// //               }}
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VoicePrediction;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import EmotionAggregationChart from "./VoiceAggregationChart";
// import EmotionPercentageChart from "./VoiceEmotionPercenatge";

// const VoicePrediction = () => {
//   const [aggregationsHourly, setAggregationsHourly] = useState([]);
//   const [emotionsPercentage, setEmotionsPercentage] = useState({});
//   const [emotionsCount, setEmotionsCount] = useState({});
//   const [lastEmotion, setLastEmotion] = useState({});
//   const [aggregations, setAggregations] = useState([]);
//   const [latestCharts, setLatestCharts] = useState({
//     mfcc: null,
//     waveform: null,
//     spectrogram: null,
//     emotion_distribution: null
//   });

//   // Load latest charts from public/assets
//   const loadLatestCharts = () => {
//     const timestamp = Date.now(); // Cache busting
//     setLatestCharts({
//       mfcc: `../assets/latest_mfcc.png?t=${timestamp}`,
//       waveform: `/assets/latest_waveform.png?t=${timestamp}`,
//       spectrogram: `/assets/latest_spectrogram.png?t=${timestamp}`,
//       emotion_distribution: `/assets/latest_emotion_distribution.png?t=${timestamp}`
//     });
//   };

//   useEffect(() => {
//     axios.get("http://localhost:4000/api/voice/voiceaggregateemotions")
//       .then((response) => {
//         setAggregations(response.data.emotions);
//         setAggregationsHourly(response.data.emotionshourly);
//       })
//       .catch((error) => {
//         console.error("Error fetching emotions:", error);
//       });

//     axios.get("http://localhost:4000/api/voice/voiceemotionsprecentage")
//       .then((response) => {
//         const percentages = response.data.percentages;
//         const counts = response.data.counts;
//         const lastpercentage = response.data.emotionLastPercentages;

//         setEmotionsPercentage(Object.fromEntries(
//           Object.entries(percentages).map(([emotion, value]) => [
//             emotion,
//             parseFloat(value)
//           ])
//         ));

//         setEmotionsCount(Object.fromEntries(
//           Object.entries(counts).map(([emotion, value]) => [
//             emotion,
//             parseFloat(value)
//           ])
//         ));

//         setLastEmotion(Object.fromEntries(
//           Object.entries(lastpercentage).map(([emotion, value]) => [
//             emotion,
//             parseFloat(value)
//           ])
//         ));
//       })
//       .catch((error) => {
//         console.error("Error fetching emotions percentages:", error);
//       });

//     // Load charts after initial data fetch
//     loadLatestCharts();
//   }, []); // Empty dependency array means this runs once on mount

//   return (
//     // <div className="voice-prediction-container">
//     //   {aggregations.length > 0 && (
//     //     <EmotionAggregationChart
//     //       emotions={aggregations}
//     //       emotionsHourly={aggregationsHourly}
//     //     />
//     //   )}

//     //   {Object.keys(emotionsPercentage).length > 0 && (
//     //     <EmotionPercentageChart
//     //       emotions={emotionsPercentage}
//     //       emotionCount={emotionsCount}
//     //       lastEmotion={lastEmotion}
//     //     />
//     //   )}

//     //   <div className="audio-visualizations">
//     //     <h2>Latest Audio Analysis</h2>

//     //     <div className="visualization-grid">
//     //       <div className="chart-container">
//     //         <h3>Audio Waveform</h3>
//     //         <img
//     //           src={latestCharts.waveform}
//     //           alt="Audio Waveform"
//     //           className="audio-chart"
//     //           onError={(e) => {
//     //             e.target.style.display = 'none';
//     //             console.log('Waveform image not found');
//     //           }}
//     //         />
//     //       </div>

//     //       <div className="chart-container">
//     //         <h3>MFCC Features</h3>
//     //         <img
//     //           src={latestCharts.mfcc}
//     //           alt="MFCC Features"
//     //           className="audio-chart"
//     //           onError={(e) => {
//     //             e.target.style.display = 'none';
//     //             console.log('MFCC image not found');
//     //           }}
//     //         />
//     //       </div>

//     //       <div className="chart-container">
//     //         <h3>Spectrogram</h3>
//     //         <img
//     //           src={latestCharts.spectrogram}
//     //           alt="Spectrogram"
//     //           className="audio-chart"
//     //           onError={(e) => {
//     //             e.target.style.display = 'none';
//     //             console.log('Spectrogram image not found');
//     //           }}
//     //         />
//     //       </div>

//     //       <div className="chart-container">
//     //         <h3>Emotion Distribution</h3>
//     //         <img
//     //           src={latestCharts.emotion_distribution}
//     //           alt="Emotion Distribution"
//     //           className="audio-chart"
//     //           onError={(e) => {
//     //             e.target.style.display = 'none';
//     //             console.log('Emotion distribution image not found');
//     //           }}
//     //         />
//     //       </div>
//     //     </div>
//     //   </div>
//     // </div>
//   );
// };

// export default VoicePrediction;

import React, { useEffect, useState } from "react";
import axios from "axios";
import EmotionAggregationChart from "./VoiceAggregationChart";
import EmotionPercentageChart from "./VoiceEmotionPercenatge";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

const VoicePrediction = () => {
  const [aggregationsHourly, setAggregationsHourly] = useState([]);
  const [emotionsPercentage, setEmotionsPercentage] = useState({});
  const [emotionsCount, setEmotionsCount] = useState({});
  const [lastEmotion, setLastEmotion] = useState({});
  const [aggregations, setAggregations] = useState([]);
  const [latestCharts, setLatestCharts] = useState({
    mfcc: null,
    waveform: null,
    spectrogram: null,
    emotion_distribution: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({
    mfcc: false,
    waveform: false,
    spectrogram: false,
    emotion_distribution: false,
  });

  // Load latest charts from public/assets
  const loadLatestCharts = () => {
    const timestamp = Date.now(); // Cache busting
    setLatestCharts({
      mfcc: `/assets/latest_mfcc.png?t=${timestamp}`,
      waveform: `/assets/latest_waveform.png?t=${timestamp}`,
      spectrogram: `/assets/latest_spectrogram.png?t=${timestamp}`,
      emotion_distribution: `/assets/latest_emotion_distribution.png?t=${timestamp}`,
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/voice/voiceaggregateemotions")
      .then((response) => {
        setAggregations(response.data.emotions);
        setAggregationsHourly(response.data.emotionshourly);
      })
      .catch((error) => {
        console.error("Error fetching emotions:", error);
      });

    axios
      .get("http://localhost:4000/api/voice/voiceemotionsprecentage")
      .then((response) => {
        const percentages = response.data.percentages;
        const counts = response.data.counts;
        const lastpercentage = response.data.emotionLastPercentages;

        setEmotionsPercentage(
          Object.fromEntries(
            Object.entries(percentages).map(([emotion, value]) => [
              emotion,
              parseFloat(value),
            ])
          )
        );

        setEmotionsCount(
          Object.fromEntries(
            Object.entries(counts).map(([emotion, value]) => [
              emotion,
              parseFloat(value),
            ])
          )
        );

        setLastEmotion(
          Object.fromEntries(
            Object.entries(lastpercentage).map(([emotion, value]) => [
              emotion,
              parseFloat(value),
            ])
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching emotions percentages:", error);
      });

    // Load charts and set loading state
    loadLatestCharts();
    setIsLoading(false);
  }, []); // Empty dependency array means this runs once on mount

  // Handle image loading errors
  const handleImageError = (chartType) => {
    setErrors((prev) => ({ ...prev, [chartType]: true }));
    console.error(`${chartType} image not found`);
  };

  return (
    <Box sx={{ padding: 0, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {aggregations.length > 0 && (
        <EmotionAggregationChart
          emotions={aggregations}
          emotionsHourly={aggregationsHourly}
        />
      )}

      {Object.keys(emotionsPercentage).length > 0 && (
        <EmotionPercentageChart
          emotions={emotionsPercentage}
          emotionCount={emotionsCount}
          lastEmotion={lastEmotion}
        />
      )}

      <Box sx={{ marginTop: 4, padding: 4 }}>
        <Typography variant="h5" gutterBottom align="center" color="primary">
          Latest Audio Analysis
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Audio Waveform Chart - Full Page */}
            <Box sx={{ marginBottom: 4 }}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
                <CardContent sx={{ padding: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    align="center"
                    color="text.primary"
                  >
                    Audio Waveform
                  </Typography>
                  {errors.waveform ? (
                    <Alert severity="error">
                      Failed to load audio waveform image
                    </Alert>
                  ) : (
                    <Box sx={{ textAlign: "center" }}>
                      <img
                        src={latestCharts.waveform}
                        alt="Audio Waveform"
                        style={{
                          width: "90vw",
                          height: "50vh",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                        onError={() => handleImageError("waveform")}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* Other Charts in Grid */}
            <Grid container spacing={3}>
              {[
                {
                  title: "MFCC Features",
                  src: latestCharts.mfcc,
                  alt: "MFCC Features",
                  type: "mfcc",
                },
                {
                  title: "Spectrogram",
                  src: latestCharts.spectrogram,
                  alt: "Spectrogram",
                  type: "spectrogram",
                },
              ].map((chart) => (
                <Grid item xs={12} sm={6} key={chart.type}>
                  <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        align="center"
                        color="text.primary"
                      >
                        {chart.title}
                      </Typography>
                      {errors[chart.type] ? (
                        <Alert severity="error">
                          Failed to load {chart.title.toLowerCase()} image
                        </Alert>
                      ) : (
                        <Box sx={{ textAlign: "center" }}>
                          <img
                            src={chart.src}
                            alt={chart.alt}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: "8px",
                            }}
                            onError={() => handleImageError(chart.type)}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default VoicePrediction;
