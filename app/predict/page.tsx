'use client';

import React,{ useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { 
  predictK2StackingRF, 
  K2InferenceFeatures, 
  K2PredictionResponse,
  predictKeplerVotingSoft,
  KeplerInferenceFeatures,
  KeplerPredictionResponse
} from '@/lib/api-service';
import { Rocket, Sparkles, ArrowRight, Info, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function PredictPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('model1');
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<K2PredictionResponse | KeplerPredictionResponse | null>(null);
  
  // Separate form data for each model
  const [model1Data, setModel1Data] = useState({
    planet_name: '',
    pl_orbper: '',
    pl_tranmid: '',
    pl_trandur: '',
    pl_rade: '',
    pl_radj: '',
    pl_radjerr1: '',
    pl_radjerr2: '',
    pl_ratror: '',
    st_rad: '',
    st_raderr1: '',
    st_raderr2: '',
    sy_dist: '',
    sy_disterr1: '',
    sy_disterr2: '',
    sy_plx: '',
    sy_plxerr1: '',
    sy_plxerr2: '',
    notes: '',
  });

  const [model2Data, setModel2Data] = useState({
    planet_name: '',
    koi_period: '',
    koi_time0bk: '',
    koi_time0: '',
    koi_impact: '',
    koi_impact_err1: '',
    koi_impact_err2: '',
    koi_duration: '',
    koi_duration_err1: '',
    koi_duration_err2: '',
    koi_depth: '',
    koi_depth_err1: '',
    koi_depth_err2: '',
    koi_ror: '',
    koi_ror_err1: '',
    koi_ror_err2: '',
    koi_srho: '',
    koi_srho_err1: '',
    koi_srho_err2: '',
    koi_prad: '',
    koi_prad_err1: '',
    koi_prad_err2: '',
    koi_sma: '',
    koi_incl: '',
    koi_teq: '',
    koi_insol: '',
    koi_insol_err1: '',
    koi_insol_err2: '',
    koi_dor: '',
    koi_dor_err1: '',
    koi_dor_err2: '',
    koi_ldm_coeff2: '',
    koi_ldm_coeff1: '',
    koi_max_sngle_ev: '',
    koi_max_mult_ev: '',
    koi_model_snr: '',
    koi_count: '',
    koi_num_transits: '',
    koi_bin_oedp_sig: '',
    koi_steff: '',
    koi_steff_err1: '',
    koi_steff_err2: '',
    koi_slogg: '',
    koi_slogg_err1: '',
    koi_slogg_err2: '',
    koi_srad: '',
    koi_srad_err1: '',
    koi_srad_err2: '',
    koi_smass: '',
    koi_smass_err1: '',
    koi_smass_err2: '',
    koi_fwm_stat_sig: '',
    notes: '',
  });

  const [model3Data, setModel3Data] = useState({
    planet_name: '',
    param1: '',
    param2: '',
    param3: '',
    param4: '',
    param5: '',
    param6: '',
    param7: '',
    param8: '',
    param9: '',
    param10: '',
    notes: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setPredictionError(null);
    setPredictionResult(null);

    try {
      // Get current model data
      const currentData = selectedModel === 'model1' ? model1Data : 
                         selectedModel === 'model2' ? model2Data : model3Data;

      // Only Model 1 is connected to the backend API (K2 Stacking RF)
      if (selectedModel === 'model1') {
        // Validate that all required numeric fields are filled
        const numericFields: (keyof typeof model1Data)[] = [
          'pl_orbper', 'pl_tranmid', 'pl_trandur', 'pl_rade', 'pl_radj',
          'pl_radjerr1', 'pl_radjerr2', 'pl_ratror', 'st_rad', 'st_raderr1',
          'st_raderr2', 'sy_dist', 'sy_disterr1', 'sy_disterr2', 'sy_plx',
          'sy_plxerr1', 'sy_plxerr2'
        ];

        // Check if any required field is empty
        const missingFields = numericFields.filter(field => !model1Data[field]);
        if (missingFields.length > 0) {
          throw new Error('Please fill in all required parameters for Model 1');
        }

        // Prepare features for API call
        const features: K2InferenceFeatures = {
          pl_orbper: parseFloat(model1Data.pl_orbper),
          pl_tranmid: parseFloat(model1Data.pl_tranmid),
          pl_trandur: parseFloat(model1Data.pl_trandur),
          pl_rade: parseFloat(model1Data.pl_rade),
          pl_radj: parseFloat(model1Data.pl_radj),
          pl_radjerr1: parseFloat(model1Data.pl_radjerr1),
          pl_radjerr2: parseFloat(model1Data.pl_radjerr2),
          pl_ratror: parseFloat(model1Data.pl_ratror),
          st_rad: parseFloat(model1Data.st_rad),
          st_raderr1: parseFloat(model1Data.st_raderr1),
          st_raderr2: parseFloat(model1Data.st_raderr2),
          sy_dist: parseFloat(model1Data.sy_dist),
          sy_disterr1: parseFloat(model1Data.sy_disterr1),
          sy_disterr2: parseFloat(model1Data.sy_disterr2),
          sy_plx: parseFloat(model1Data.sy_plx),
          sy_plxerr1: parseFloat(model1Data.sy_plxerr1),
          sy_plxerr2: parseFloat(model1Data.sy_plxerr2),
        };

        // Call the backend API
        const apiResponse = await predictK2StackingRF(features);
        
        // Store the result to display
        setPredictionResult(apiResponse);
        
        // Save to database for history
        const isExoplanet = apiResponse.prediction.toLowerCase() === 'candidate' || 
                           apiResponse.prediction.toLowerCase() === 'confirmed';
        
        const { error: dbError } = await supabase.from('predictions').insert({
          user_id: user!.id,
          planet_name: currentData.planet_name,
          model_used: selectedModel,
          prediction_result: apiResponse.prediction,
          confidence_score: apiResponse.confidence,
          is_exoplanet: isExoplanet,
          parameters: features,
          notes: currentData.notes,
        });

        if (dbError) {
          // console.error('Database error:', dbError);
          // Don't throw - we still got the prediction, just log the error
          toast.warning('Prediction successful but failed to save to history');
        }
        
        toast.success(`Prediction completed! Result: ${apiResponse.prediction} (${(apiResponse.confidence * 100).toFixed(1)}% confidence)`);
      } else if (selectedModel === 'model2') {
        // Model 2: Kepler Voting Soft
        // Validate that all required numeric fields are filled
        const numericFields: (keyof typeof model2Data)[] = [
          'koi_period', 'koi_time0bk', 'koi_time0', 'koi_impact', 'koi_impact_err1', 'koi_impact_err2',
          'koi_duration', 'koi_duration_err1', 'koi_duration_err2', 'koi_depth', 'koi_depth_err1', 'koi_depth_err2',
          'koi_ror', 'koi_ror_err1', 'koi_ror_err2', 'koi_srho', 'koi_srho_err1', 'koi_srho_err2',
          'koi_prad', 'koi_prad_err1', 'koi_prad_err2', 'koi_sma', 'koi_incl', 'koi_teq',
          'koi_insol', 'koi_insol_err1', 'koi_insol_err2', 'koi_dor', 'koi_dor_err1', 'koi_dor_err2',
          'koi_ldm_coeff2', 'koi_ldm_coeff1', 'koi_max_sngle_ev', 'koi_max_mult_ev', 'koi_model_snr',
          'koi_count', 'koi_num_transits', 'koi_bin_oedp_sig', 'koi_steff', 'koi_steff_err1', 'koi_steff_err2',
          'koi_slogg', 'koi_slogg_err1', 'koi_slogg_err2', 'koi_srad', 'koi_srad_err1', 'koi_srad_err2',
          'koi_smass', 'koi_smass_err1', 'koi_smass_err2', 'koi_fwm_stat_sig'
        ];

        // Check if any required field is empty
        const missingFields = numericFields.filter(field => !model2Data[field]);
        if (missingFields.length > 0) {
          throw new Error('Please fill in all required parameters for Model 2');
        }

        // Prepare features for API call
        const features: KeplerInferenceFeatures = {
          koi_period: parseFloat(model2Data.koi_period),
          koi_time0bk: parseFloat(model2Data.koi_time0bk),
          koi_time0: parseFloat(model2Data.koi_time0),
          koi_impact: parseFloat(model2Data.koi_impact),
          koi_impact_err1: parseFloat(model2Data.koi_impact_err1),
          koi_impact_err2: parseFloat(model2Data.koi_impact_err2),
          koi_duration: parseFloat(model2Data.koi_duration),
          koi_duration_err1: parseFloat(model2Data.koi_duration_err1),
          koi_duration_err2: parseFloat(model2Data.koi_duration_err2),
          koi_depth: parseFloat(model2Data.koi_depth),
          koi_depth_err1: parseFloat(model2Data.koi_depth_err1),
          koi_depth_err2: parseFloat(model2Data.koi_depth_err2),
          koi_ror: parseFloat(model2Data.koi_ror),
          koi_ror_err1: parseFloat(model2Data.koi_ror_err1),
          koi_ror_err2: parseFloat(model2Data.koi_ror_err2),
          koi_srho: parseFloat(model2Data.koi_srho),
          koi_srho_err1: parseFloat(model2Data.koi_srho_err1),
          koi_srho_err2: parseFloat(model2Data.koi_srho_err2),
          koi_prad: parseFloat(model2Data.koi_prad),
          koi_prad_err1: parseFloat(model2Data.koi_prad_err1),
          koi_prad_err2: parseFloat(model2Data.koi_prad_err2),
          koi_sma: parseFloat(model2Data.koi_sma),
          koi_incl: parseFloat(model2Data.koi_incl),
          koi_teq: parseFloat(model2Data.koi_teq),
          koi_insol: parseFloat(model2Data.koi_insol),
          koi_insol_err1: parseFloat(model2Data.koi_insol_err1),
          koi_insol_err2: parseFloat(model2Data.koi_insol_err2),
          koi_dor: parseFloat(model2Data.koi_dor),
          koi_dor_err1: parseFloat(model2Data.koi_dor_err1),
          koi_dor_err2: parseFloat(model2Data.koi_dor_err2),
          koi_ldm_coeff2: parseFloat(model2Data.koi_ldm_coeff2),
          koi_ldm_coeff1: parseFloat(model2Data.koi_ldm_coeff1),
          koi_max_sngle_ev: parseFloat(model2Data.koi_max_sngle_ev),
          koi_max_mult_ev: parseFloat(model2Data.koi_max_mult_ev),
          koi_model_snr: parseFloat(model2Data.koi_model_snr),
          koi_count: parseFloat(model2Data.koi_count),
          koi_num_transits: parseFloat(model2Data.koi_num_transits),
          koi_bin_oedp_sig: parseFloat(model2Data.koi_bin_oedp_sig),
          koi_steff: parseFloat(model2Data.koi_steff),
          koi_steff_err1: parseFloat(model2Data.koi_steff_err1),
          koi_steff_err2: parseFloat(model2Data.koi_steff_err2),
          koi_slogg: parseFloat(model2Data.koi_slogg),
          koi_slogg_err1: parseFloat(model2Data.koi_slogg_err1),
          koi_slogg_err2: parseFloat(model2Data.koi_slogg_err2),
          koi_srad: parseFloat(model2Data.koi_srad),
          koi_srad_err1: parseFloat(model2Data.koi_srad_err1),
          koi_srad_err2: parseFloat(model2Data.koi_srad_err2),
          koi_smass: parseFloat(model2Data.koi_smass),
          koi_smass_err1: parseFloat(model2Data.koi_smass_err1),
          koi_smass_err2: parseFloat(model2Data.koi_smass_err2),
          koi_fwm_stat_sig: parseFloat(model2Data.koi_fwm_stat_sig),
        };

        // Call the backend API
        const apiResponse = await predictKeplerVotingSoft(features);
        
        // Store the result to display
        setPredictionResult(apiResponse);
        
        // Save to database for history
        const isExoplanet = apiResponse.prediction.toLowerCase() === 'candidate' || 
                           apiResponse.prediction.toLowerCase() === 'confirmed';
        
        const { error: dbError } = await supabase.from('predictions').insert({
          user_id: user!.id,
          planet_name: currentData.planet_name,
          model_used: selectedModel,
          prediction_result: apiResponse.prediction,
          confidence_score: apiResponse.confidence,
          is_exoplanet: isExoplanet,
          parameters: features,
          notes: currentData.notes,
        });

        if (dbError) {
          console.error('Database error:', dbError);
          // Don't throw - we still got the prediction, just log the error
          toast.warning('Prediction successful but failed to save to history');
        }
        
        const confidenceText = apiResponse.confidence !== null ? ` (${(apiResponse.confidence * 100).toFixed(1)}% confidence)` : '';
        toast.success(`Prediction completed! Result: ${apiResponse.prediction}${confidenceText}`);
      } else {
        // Model 3 not yet connected - show message
        toast.info('Model 3 is not yet connected to the backend.');
        throw new Error('Model 3 is not yet implemented. Please select Model 1 or Model 2.');
      }
    } catch (error: any) {
      console.error('Prediction error:', error);
      setPredictionError(error.message || 'Failed to get prediction');
      toast.error(error.message || 'Failed to submit prediction');
    } finally {
      setSubmitting(false);
    }
  };

  // Field definitions for Model 1 (K2 Stacking RF)
  const model1Fields = [
    {
      id: 'planet_name',
      label: 'Planet Name',
      type: 'text',
      placeholder: 'e.g., Kepler-452c',
      tooltip: 'A unique identifier for your planetary candidate',
      required: true,
    },
    {
      id: 'pl_orbper',
      label: 'Orbital Period (days)',
      type: 'number',
      placeholder: 'e.g., 365.25',
      tooltip: 'Time it takes the planet to complete one orbit around its star',
      step: '0.01',
    },
    {
      id: 'pl_tranmid',
      label: 'Transit Midpoint (days)',
      type: 'number',
      placeholder: 'e.g., 2454833.0',
      tooltip: 'Time of the center of the transit in Julian Date',
      step: '0.00001',
    },
    {
      id: 'pl_trandur',
      label: 'Transit Duration (hours)',
      type: 'number',
      placeholder: 'e.g., 6.5',
      tooltip: 'How long the planet takes to cross in front of its star',
      step: '0.01',
    },
    {
      id: 'pl_rade',
      label: 'Planet Radius (Earth radii)',
      type: 'number',
      placeholder: 'e.g., 1.6',
      tooltip: 'Size of the planet relative to Earth (1 R⊕ = Earth radius)',
      step: '0.01',
    },
    {
      id: 'pl_radj',
      label: 'Planet Radius (Jupiter radii)',
      type: 'number',
      placeholder: 'e.g., 0.14',
      tooltip: 'Size of the planet relative to Jupiter (1 RJ = Jupiter radius)',
      step: '0.001',
    },
    {
      id: 'pl_radjerr1',
      label: 'Planet Radius Upper Unc. (Jupiter radii)',
      type: 'number',
      placeholder: 'e.g., 0.01',
      tooltip: 'Upper uncertainty in planet radius measurement',
      step: '0.001',
    },
    {
      id: 'pl_radjerr2',
      label: 'Planet Radius Lower Unc. (Jupiter radii)',
      type: 'number',
      placeholder: 'e.g., -0.01',
      tooltip: 'Lower uncertainty in planet radius measurement',
      step: '0.001',
    },
    {
      id: 'pl_ratror',
      label: 'Ratio of Planet to Stellar Radius',
      type: 'number',
      placeholder: 'e.g., 0.08',
      tooltip: 'Ratio of the planet radius to the stellar radius',
      step: '0.001',
    },
    {
      id: 'st_rad',
      label: 'Stellar Radius (Solar radii)',
      type: 'number',
      placeholder: 'e.g., 1.0',
      tooltip: 'Size of the host star relative to the Sun',
      step: '0.01',
    },
    {
      id: 'st_raderr1',
      label: 'Stellar Radius Upper Unc. (Solar radii)',
      type: 'number',
      placeholder: 'e.g., 0.05',
      tooltip: 'Upper uncertainty in stellar radius measurement',
      step: '0.01',
    },
    {
      id: 'st_raderr2',
      label: 'Stellar Radius Lower Unc. (Solar radii)',
      type: 'number',
      placeholder: 'e.g., -0.05',
      tooltip: 'Lower uncertainty in stellar radius measurement',
      step: '0.01',
    },
    {
      id: 'sy_dist',
      label: 'Distance (pc)',
      type: 'number',
      placeholder: 'e.g., 100.5',
      tooltip: 'Distance to the system in parsecs',
      step: '0.1',
    },
    {
      id: 'sy_disterr1',
      label: 'Distance Upper Unc. (pc)',
      type: 'number',
      placeholder: 'e.g., 2.5',
      tooltip: 'Upper uncertainty in distance measurement',
      step: '0.1',
    },
    {
      id: 'sy_disterr2',
      label: 'Distance Lower Unc. (pc)',
      type: 'number',
      placeholder: 'e.g., -2.5',
      tooltip: 'Lower uncertainty in distance measurement',
      step: '0.1',
    },
    {
      id: 'sy_plx',
      label: 'Parallax (mas)',
      type: 'number',
      placeholder: 'e.g., 10.0',
      tooltip: 'Parallax of the system in milliarcseconds',
      step: '0.001',
    },
    {
      id: 'sy_plxerr1',
      label: 'Parallax Upper Unc. (mas)',
      type: 'number',
      placeholder: 'e.g., 0.5',
      tooltip: 'Upper uncertainty in parallax measurement',
      step: '0.001',
    },
    {
      id: 'sy_plxerr2',
      label: 'Parallax Lower Unc. (mas)',
      type: 'number',
      placeholder: 'e.g., -0.5',
      tooltip: 'Lower uncertainty in parallax measurement',
      step: '0.001',
    },
  ];

  // Field definitions for Model 2 (Kepler Voting Soft)
  const model2Fields = [
    {
      id: 'planet_name',
      label: 'Planet Name',
      type: 'text',
      placeholder: 'e.g., KOI-123',
      tooltip: 'Kepler Object of Interest identifier',
      required: true,
    },
    // Orbital and Transit Parameters
    {
      id: 'koi_period',
      label: 'Orbital Period (days)',
      type: 'number',
      placeholder: 'e.g., 365.25',
      tooltip: 'Orbital Period [days]',
      step: '0.0001',
    },
    {
      id: 'koi_time0bk',
      label: 'Transit Epoch (BKJD)',
      type: 'number',
      placeholder: 'e.g., 131.5',
      tooltip: 'Transit Epoch [BKJD]',
      step: '0.00001',
    },
    {
      id: 'koi_time0',
      label: 'Transit Epoch (BJD)',
      type: 'number',
      placeholder: 'e.g., 2454965.5',
      tooltip: 'Transit Epoch [BJD]',
      step: '0.00001',
    },
    {
      id: 'koi_impact',
      label: 'Impact Parameter',
      type: 'number',
      placeholder: 'e.g., 0.5',
      tooltip: 'Impact Parameter',
      step: '0.001',
    },
    {
      id: 'koi_impact_err1',
      label: 'Impact Parameter Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 0.05',
      tooltip: 'Impact Parameter Upper Uncertainty',
      step: '0.001',
    },
    {
      id: 'koi_impact_err2',
      label: 'Impact Parameter Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -0.05',
      tooltip: 'Impact Parameter Lower Uncertainty',
      step: '0.001',
    },
    {
      id: 'koi_duration',
      label: 'Transit Duration (hrs)',
      type: 'number',
      placeholder: 'e.g., 6.5',
      tooltip: 'Transit Duration [hrs]',
      step: '0.01',
    },
    {
      id: 'koi_duration_err1',
      label: 'Transit Duration Upper Unc. (hrs)',
      type: 'number',
      placeholder: 'e.g., 0.5',
      tooltip: 'Transit Duration Upper Unc. [hrs]',
      step: '0.01',
    },
    {
      id: 'koi_duration_err2',
      label: 'Transit Duration Lower Unc. (hrs)',
      type: 'number',
      placeholder: 'e.g., -0.5',
      tooltip: 'Transit Duration Lower Unc. [hrs]',
      step: '0.01',
    },
    {
      id: 'koi_depth',
      label: 'Transit Depth (ppm)',
      type: 'number',
      placeholder: 'e.g., 100',
      tooltip: 'Transit Depth [ppm]',
      step: '0.1',
    },
    {
      id: 'koi_depth_err1',
      label: 'Transit Depth Upper Unc. (ppm)',
      type: 'number',
      placeholder: 'e.g., 10',
      tooltip: 'Transit Depth Upper Unc. [ppm]',
      step: '0.1',
    },
    {
      id: 'koi_depth_err2',
      label: 'Transit Depth Lower Unc. (ppm)',
      type: 'number',
      placeholder: 'e.g., -10',
      tooltip: 'Transit Depth Lower Unc. [ppm]',
      step: '0.1',
    },
    // Planet-Star Ratios
    {
      id: 'koi_ror',
      label: 'Planet-Star Radius Ratio',
      type: 'number',
      placeholder: 'e.g., 0.08',
      tooltip: 'Planet-Star Radius Ratio',
      step: '0.0001',
    },
    {
      id: 'koi_ror_err1',
      label: 'Planet-Star Radius Ratio Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 0.005',
      tooltip: 'Planet-Star Radius Ratio Upper Uncertainty',
      step: '0.0001',
    },
    {
      id: 'koi_ror_err2',
      label: 'Planet-Star Radius Ratio Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -0.005',
      tooltip: 'Planet-Star Radius Ratio Lower Uncertainty',
      step: '0.0001',
    },
    {
      id: 'koi_srho',
      label: 'Fitted Stellar Density (g/cm³)',
      type: 'number',
      placeholder: 'e.g., 1.4',
      tooltip: 'Fitted Stellar Density [g/cm**3]',
      step: '0.01',
    },
    {
      id: 'koi_srho_err1',
      label: 'Fitted Stellar Density Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 0.1',
      tooltip: 'Fitted Stellar Density Upper Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_srho_err2',
      label: 'Fitted Stellar Density Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -0.1',
      tooltip: 'Fitted Stellar Density Lower Uncertainty',
      step: '0.01',
    },
    // Planetary Properties
    {
      id: 'koi_prad',
      label: 'Planetary Radius (Earth radii)',
      type: 'number',
      placeholder: 'e.g., 1.5',
      tooltip: 'Planetary Radius [Earth radii]',
      step: '0.01',
    },
    {
      id: 'koi_prad_err1',
      label: 'Planetary Radius Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 0.1',
      tooltip: 'Planetary Radius Upper Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_prad_err2',
      label: 'Planetary Radius Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -0.1',
      tooltip: 'Planetary Radius Lower Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_sma',
      label: 'Orbit Semi-Major Axis (au)',
      type: 'number',
      placeholder: 'e.g., 1.0',
      tooltip: 'Orbit Semi-Major Axis [au]',
      step: '0.001',
    },
    {
      id: 'koi_incl',
      label: 'Inclination (deg)',
      type: 'number',
      placeholder: 'e.g., 89.5',
      tooltip: 'Inclination [deg]',
      step: '0.01',
    },
    {
      id: 'koi_teq',
      label: 'Equilibrium Temperature (K)',
      type: 'number',
      placeholder: 'e.g., 288',
      tooltip: 'Equilibrium Temperature [K]',
      step: '1',
    },
    {
      id: 'koi_insol',
      label: 'Insolation Flux (Earth flux)',
      type: 'number',
      placeholder: 'e.g., 1.0',
      tooltip: 'Insolation Flux [Earth flux]',
      step: '0.01',
    },
    {
      id: 'koi_insol_err1',
      label: 'Insolation Flux Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 0.05',
      tooltip: 'Insolation Flux Upper Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_insol_err2',
      label: 'Insolation Flux Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -0.05',
      tooltip: 'Insolation Flux Lower Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_dor',
      label: 'Planet-Star Distance over Star Radius',
      type: 'number',
      placeholder: 'e.g., 10',
      tooltip: 'Planet-Star Distance over Star Radius',
      step: '0.01',
    },
    {
      id: 'koi_dor_err1',
      label: 'Planet-Star Distance/Radius Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 0.5',
      tooltip: 'Planet-Star Distance over Star Radius Upper Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_dor_err2',
      label: 'Planet-Star Distance/Radius Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -0.5',
      tooltip: 'Planet-Star Distance over Star Radius Lower Uncertainty',
      step: '0.01',
    },
    // Limb Darkening
    {
      id: 'koi_ldm_coeff2',
      label: 'Limb Darkening Coeff. 2',
      type: 'number',
      placeholder: 'e.g., 0.3',
      tooltip: 'Limb Darkening Coefficient 2',
      step: '0.01',
    },
    {
      id: 'koi_ldm_coeff1',
      label: 'Limb Darkening Coeff. 1',
      type: 'number',
      placeholder: 'e.g., 0.5',
      tooltip: 'Limb Darkening Coefficient 1',
      step: '0.01',
    },
    // Statistics
    {
      id: 'koi_max_sngle_ev',
      label: 'Maximum Single Event Statistic',
      type: 'number',
      placeholder: 'e.g., 10',
      tooltip: 'Maximum Single Event Statistic',
      step: '0.1',
    },
    {
      id: 'koi_max_mult_ev',
      label: 'Maximum Multiple Event Statistic',
      type: 'number',
      placeholder: 'e.g., 50',
      tooltip: 'Maximum Multiple Event Statistic',
      step: '0.1',
    },
    {
      id: 'koi_model_snr',
      label: 'Transit Signal-to-Noise',
      type: 'number',
      placeholder: 'e.g., 15',
      tooltip: 'Transit Signal-to-Noise',
      step: '0.1',
    },
    {
      id: 'koi_count',
      label: 'Number of Planets',
      type: 'number',
      placeholder: 'e.g., 1',
      tooltip: 'Number of Planets',
      step: '1',
    },
    {
      id: 'koi_num_transits',
      label: 'Number of Transits',
      type: 'number',
      placeholder: 'e.g., 5',
      tooltip: 'Number of Transits',
      step: '1',
    },
    {
      id: 'koi_bin_oedp_sig',
      label: 'Odd-Even Depth Comparison Statistic',
      type: 'number',
      placeholder: 'e.g., 1.5',
      tooltip: 'Odd-Even Depth Comparison Statistic',
      step: '0.01',
    },
    // Stellar Properties
    {
      id: 'koi_steff',
      label: 'Stellar Effective Temperature (K)',
      type: 'number',
      placeholder: 'e.g., 5778',
      tooltip: 'Stellar Effective Temperature [K]',
      step: '1',
    },
    {
      id: 'koi_steff_err1',
      label: 'Stellar Effective Temperature Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 50',
      tooltip: 'Stellar Effective Temperature Upper Uncertainty',
      step: '1',
    },
    {
      id: 'koi_steff_err2',
      label: 'Stellar Effective Temperature Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -50',
      tooltip: 'Stellar Effective Temperature Lower Uncertainty',
      step: '1',
    },
    {
      id: 'koi_slogg',
      label: 'Stellar Surface Gravity (log10(cm/s²))',
      type: 'number',
      placeholder: 'e.g., 4.44',
      tooltip: 'Stellar Surface Gravity [log10(cm/s**2)]',
      step: '0.01',
    },
    {
      id: 'koi_slogg_err1',
      label: 'Stellar Surface Gravity Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 0.05',
      tooltip: 'Stellar Surface Gravity Upper Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_slogg_err2',
      label: 'Stellar Surface Gravity Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -0.05',
      tooltip: 'Stellar Surface Gravity Lower Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_srad',
      label: 'Stellar Radius (Solar radii)',
      type: 'number',
      placeholder: 'e.g., 1.0',
      tooltip: 'Stellar Radius [Solar radii]',
      step: '0.01',
    },
    {
      id: 'koi_srad_err1',
      label: 'Stellar Radius Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 0.05',
      tooltip: 'Stellar Radius Upper Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_srad_err2',
      label: 'Stellar Radius Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -0.05',
      tooltip: 'Stellar Radius Lower Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_smass',
      label: 'Stellar Mass (Solar mass)',
      type: 'number',
      placeholder: 'e.g., 1.0',
      tooltip: 'Stellar Mass [Solar mass]',
      step: '0.01',
    },
    {
      id: 'koi_smass_err1',
      label: 'Stellar Mass Upper Unc.',
      type: 'number',
      placeholder: 'e.g., 0.05',
      tooltip: 'Stellar Mass Upper Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_smass_err2',
      label: 'Stellar Mass Lower Unc.',
      type: 'number',
      placeholder: 'e.g., -0.05',
      tooltip: 'Stellar Mass Lower Uncertainty',
      step: '0.01',
    },
    {
      id: 'koi_fwm_stat_sig',
      label: 'FW Offset Significance (%)',
      type: 'number',
      placeholder: 'e.g., 5',
      tooltip: 'FW Offset Significance [percent]',
      step: '0.1',
    },
  ];

  // Field definitions for Model 3
  const model3Fields = [
    {
      id: 'planet_name',
      label: 'Planet Name',
      type: 'text',
      placeholder: 'e.g., Kepler-452c',
      tooltip: 'A unique identifier for your planetary candidate',
      required: true,
    },
    {
      id: 'param1',
      label: 'Parameter 1',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'First parameter for Model 3',
      step: '0.01',
    },
    {
      id: 'param2',
      label: 'Parameter 2',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'Second parameter for Model 3',
      step: '0.01',
    },
    {
      id: 'param3',
      label: 'Parameter 3',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'Third parameter for Model 3',
      step: '0.01',
    },
    {
      id: 'param4',
      label: 'Parameter 4',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'Fourth parameter for Model 3',
      step: '0.01',
    },
    {
      id: 'param5',
      label: 'Parameter 5',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'Fifth parameter for Model 3',
      step: '0.01',
    },
    {
      id: 'param6',
      label: 'Parameter 6',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'Sixth parameter for Model 3',
      step: '0.01',
    },
    {
      id: 'param7',
      label: 'Parameter 7',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'Seventh parameter for Model 3',
      step: '0.01',
    },
    {
      id: 'param8',
      label: 'Parameter 8',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'Eighth parameter for Model 3',
      step: '0.01',
    },
    {
      id: 'param9',
      label: 'Parameter 9',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'Ninth parameter for Model 3',
      step: '0.01',
    },
    {
      id: 'param10',
      label: 'Parameter 10',
      type: 'number',
      placeholder: 'Enter value',
      tooltip: 'Tenth parameter for Model 3',
      step: '0.01',
    },
  ];

  // Get current fields and data based on selected model
  const getCurrentFields = () => {
    if (selectedModel === 'model1') return model1Fields;
    if (selectedModel === 'model2') return model2Fields;
    return model3Fields;
  };

  const getCurrentData = () => {
    if (selectedModel === 'model1') return model1Data;
    if (selectedModel === 'model2') return model2Data;
    return model3Data;
  };

  const setCurrentData = (newData: any) => {
    if (selectedModel === 'model1') setModel1Data(newData);
    else if (selectedModel === 'model2') setModel2Data(newData);
    else setModel3Data(newData);
  };

  const currentFields = getCurrentFields();
  const currentData = getCurrentData();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Rocket className="h-16 w-16 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="h-12 w-12 text-primary animate-float" />
          </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="bg-gradient-to-r text-white bg-clip-text text-transparent">
            Terra
          </span>
          <span className="bg-gradient-to-r text-blue-500 bg-clip-text text-transparent">
            Finder
          </span>
        </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-white">
            Enter planetary parameters for AI-powered exoplanet analysis
          </p>
        </div>

        <Card className="border-0 bg-white/95 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Planetary Parameters
            </CardTitle>
            <CardDescription>
              Fill in as many parameters as possible for accurate predictions. Our ML model will analyze the data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {predictionError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{predictionError}</AlertDescription>
                </Alert>
              )}

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model-select" className="text-base font-semibold">
                  Select ML Model
                </Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="model-select" className="bg-white">
                    <SelectValue placeholder="Choose a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="model1">Model 1 - K2 Stacking RF</SelectItem>
                    <SelectItem value="model2">Model 2 - Kepler Voting Soft</SelectItem>
                    <SelectItem value="model3">Model 3 (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {selectedModel === 'model1' && 'Model 1: K2 Stacking Random Forest - Optimized for K2 mission transit and orbital parameters'}
                  {selectedModel === 'model2' && 'Model 2: Kepler Voting Soft - Comprehensive Kepler mission parameters with ensemble voting'}
                  {selectedModel === 'model3' && 'Model 3: Experimental parameter set (Not yet connected)'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <TooltipProvider>
                  {currentFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="flex items-center gap-2">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{field.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={currentData[field.id as keyof typeof currentData]}
                        onChange={(e) =>
                          setCurrentData({ ...currentData, [field.id]: e.target.value })
                        }
                        required={field.required}
                        step={field.step}
                        className="bg-white"
                      />
                    </div>
                  ))}
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional observations or context about this planetary candidate..."
                  value={currentData.notes}
                  onChange={(e) => setCurrentData({ ...currentData, notes: e.target.value })}
                  rows={4}
                  className="bg-white"
                />
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground mb-1">How it works</p>
                    <p className="text-muted-foreground">
                      {selectedModel === 'model1' 
                        ? 'Model 1 uses a K2 Stacking Random Forest algorithm trained on Kepler-2 mission data. It analyzes your planetary parameters and compares them against patterns from confirmed exoplanets to provide a prediction with confidence score.'
                        : 'Our machine learning model analyzes the planetary parameters you provide and compares them against patterns from confirmed exoplanets. The prediction includes a confidence score indicating the likelihood of this being an actual exoplanet.'}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-spin" />
                    {selectedModel === 'model1' ? 'Calling ML Model...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    Submit Prediction
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Prediction Result Display */}
        {predictionResult && (
          <Card className="border-0 bg-white/95 backdrop-blur-md shadow-2xl mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {predictionResult.prediction.toLowerCase() === 'confirmed' ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                Prediction Result
              </CardTitle>
              <CardDescription>
                Analysis completed for {model1Data.planet_name || 'your planetary candidate'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Result */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Classification
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${
                    predictionResult.prediction.toLowerCase() === 'confirmed' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {predictionResult.prediction.toUpperCase()}
                  </div>
                  {predictionResult.confidence !== null && (
                    <div className="text-2xl font-semibold text-primary">
                      {(predictionResult.confidence * 100).toFixed(2)}% Confidence
                    </div>
                  )}
                </div>
              </div>

              {/* Class Probabilities */}
              {predictionResult.class_probabilities && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    Class Probabilities
                  </h4>
                  {Object.entries(predictionResult.class_probabilities).map(([className, probability]) => (
                  <div key={className} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{className}</span>
                      <span className="text-muted-foreground">
                        {(probability * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          className.toLowerCase() === 'confirmed'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${probability * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPredictionResult(null);
                    setPredictionError(null);
                  }}
                >
                  New Prediction
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    const confidenceText = predictionResult.confidence !== null 
                      ? `\nConfidence: ${(predictionResult.confidence * 100).toFixed(2)}%` 
                      : '';
                    const resultText = `Planet: ${currentData.planet_name}\nPrediction: ${predictionResult.prediction}${confidenceText}`;
                    navigator.clipboard.writeText(resultText);
                    toast.success('Result copied to clipboard!');
                  }}
                >
                  Copy Result
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="border-0 bg-white/90 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {selectedModel === 'model3' ? '10+' : '18+'}
                </div>
                <div className="text-sm text-muted-foreground">Parameters Analyzed</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/90 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">3</div>
                <div className="text-sm text-muted-foreground">ML Models Available</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/90 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Model Accuracy</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
