import API_CONFIG from './api-config';

// Types matching backend schemas
export interface K2InferenceFeatures {
  pl_orbper: number;
  pl_tranmid: number;
  pl_trandur: number;
  pl_rade: number;
  pl_radj: number;
  pl_radjerr1: number;
  pl_radjerr2: number;
  pl_ratror: number;
  st_rad: number;
  st_raderr1: number;
  st_raderr2: number;
  sy_dist: number;
  sy_disterr1: number;
  sy_disterr2: number;
  sy_plx: number;
  sy_plxerr1: number;
  sy_plxerr2: number;
}

export interface KeplerInferenceFeatures {
  koi_period: number;
  koi_time0bk: number;
  koi_time0: number;
  koi_impact: number;
  koi_impact_err1: number;
  koi_impact_err2: number;
  koi_duration: number;
  koi_duration_err1: number;
  koi_duration_err2: number;
  koi_depth: number;
  koi_depth_err1: number;
  koi_depth_err2: number;
  koi_ror: number;
  koi_ror_err1: number;
  koi_ror_err2: number;
  koi_srho: number;
  koi_srho_err1: number;
  koi_srho_err2: number;
  koi_prad: number;
  koi_prad_err1: number;
  koi_prad_err2: number;
  koi_sma: number;
  koi_incl: number;
  koi_teq: number;
  koi_insol: number;
  koi_insol_err1: number;
  koi_insol_err2: number;
  koi_dor: number;
  koi_dor_err1: number;
  koi_dor_err2: number;
  koi_ldm_coeff2: number;
  koi_ldm_coeff1: number;
  koi_max_sngle_ev: number;
  koi_max_mult_ev: number;
  koi_model_snr: number;
  koi_count: number;
  koi_num_transits: number;
  koi_bin_oedp_sig: number;
  koi_steff: number;
  koi_steff_err1: number;
  koi_steff_err2: number;
  koi_slogg: number;
  koi_slogg_err1: number;
  koi_slogg_err2: number;
  koi_srad: number;
  koi_srad_err1: number;
  koi_srad_err2: number;
  koi_smass: number;
  koi_smass_err1: number;
  koi_smass_err2: number;
  koi_fwm_stat_sig: number;
}

export interface MergedInferenceFeatures {
  orbital_period: number;
  transit_duration: number;
  transit_duration_err1: number;
  transit_duration_err2: number;
  transit_depth: number;
  transit_depth_err1: number;
  transit_depth_err2: number;
  planet_radius: number;
  planet_radius_err1: number;
  planet_radius_err2: number;
  equi_temp: number;
  stellar_temp: number;
  stellar_temp_err1: number;
  stellar_temp_err2: number;
  stellar_radius: number;
  stellar_radius_err1: number;
  stellar_radius_err2: number;
}

export interface K2PredictionResponse {
  prediction: string;
  confidence: number;
  class_probabilities: {
    [key: string]: number;
  };
}

export interface KeplerPredictionResponse {
  prediction: string;
  confidence: number | null;
  class_probabilities: {
    [key: string]: number;
  } | null;
}

export interface MergedPredictionResponse {
  prediction: number; // 0 or 1
  confidence: number | null;
  class_probabilities: {
    [key: string]: number;
  } | null;
}

/**
 * Call the K2 Stacking RF model prediction endpoint
 * @param features - The exoplanet features for prediction
 * @returns Prediction response with confidence score
 */
export async function predictK2StackingRF(
  features: K2InferenceFeatures
): Promise<K2PredictionResponse> {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.k2StackingRF}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `API request failed with status ${response.status}`
      );
    }

    const data: K2PredictionResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get prediction: ${error.message}`);
    }
    throw new Error('Failed to get prediction: Unknown error');
  }
}

/**
 * Download the K2 dataset CSV file
 * @returns Blob of the CSV file
 */
export async function downloadK2Dataset(): Promise<Blob> {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.k2Dataset}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download dataset: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to download dataset: ${error.message}`);
    }
    throw new Error('Failed to download dataset: Unknown error');
  }
}

/**
 * Call the Kepler Voting Soft model prediction endpoint
 * @param features - The Kepler exoplanet features for prediction
 * @returns Prediction response with confidence score
 */
export async function predictKeplerVotingSoft(
  features: KeplerInferenceFeatures
): Promise<KeplerPredictionResponse> {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.keplerVotingSoft}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `API request failed with status ${response.status}`
      );
    }

    const data: KeplerPredictionResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get prediction: ${error.message}`);
    }
    throw new Error('Failed to get prediction: Unknown error');
  }
}

/**
 * Download the Kepler dataset CSV file
 * @returns Blob of the CSV file
 */
export async function downloadKeplerDataset(): Promise<Blob> {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.keplerDataset}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download dataset: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to download dataset: ${error.message}`);
    }
    throw new Error('Failed to download dataset: Unknown error');
  }
}

/**
 * Call the Merged Stacking Logistic Regression model prediction endpoint
 * @param features - The merged exoplanet features for prediction
 * @returns Prediction response with confidence score (prediction is 0 or 1)
 */
export async function predictMergedStackingLogReg(
  features: MergedInferenceFeatures
): Promise<MergedPredictionResponse> {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.mergedStackingLogReg}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `API request failed with status ${response.status}`
      );
    }

    const data: MergedPredictionResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get prediction: ${error.message}`);
    }
    throw new Error('Failed to get prediction: Unknown error');
  }
}

/**
 * Download the Merged dataset CSV file
 * @returns Blob of the CSV file
 */
export async function downloadMergedDataset(): Promise<Blob> {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.mergedDataset}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download dataset: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to download dataset: ${error.message}`);
    }
    throw new Error('Failed to download dataset: Unknown error');
  }
}
