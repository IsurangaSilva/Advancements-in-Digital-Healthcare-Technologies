import React, { useState, useEffect } from 'react';
import DepressionPredictionsUI from './DepressionPredictionsUI';
import { useDepressionPredictions } from './DepressionPredictionsLogic';

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