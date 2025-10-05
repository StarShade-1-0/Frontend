// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  endpoints: {
    k2StackingRF: '/k2/stacking_rf/predict',
    k2Dataset: '/k2/dataset',
    keplerVotingSoft: '/kepler/voting_soft/predict',
    keplerDataset: '/kepler/dataset',
    mergedStackingLogReg: '/merged/stacking_logreg/predict',
    mergedDataset: '/merged/dataset',
  },
};

export default API_CONFIG;
