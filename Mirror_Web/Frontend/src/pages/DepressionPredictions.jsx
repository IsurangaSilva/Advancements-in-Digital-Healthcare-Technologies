import React, { useState, useEffect } from 'react';
import DepressionPredictionsUI from './DepressionPredictionsUI';
import { useDepressionPredictions } from './DepressionPredictionsLogic';

/**
 * DepressionPredictions Component
 * 
 * This is the main component that serves as a bridge between the UI and business logic.
 * It uses the custom hook from DepressionPredictionsLogic.js and passes the data
 * to DepressionPredictionsUI.jsx for rendering.
 */
const DepressionPredictions = () => {
  // Get all necessary data and handlers from the logic hook
  const {
    loading,
    error,
    emailError,
    predictionData,
    getDepressionLevel
  } = useDepressionPredictions();

  // Pass all the props to the UI component
  return (
    <DepressionPredictionsUI
      loading={loading}
      error={error}
      emailError={emailError}
      predictionData={predictionData}
      getDepressionLevel={getDepressionLevel}
    />
  );
};

export default DepressionPredictions;