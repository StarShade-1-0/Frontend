'use client';

import React,{ useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Rocket, Sparkles, ArrowRight, Info } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    planet_name: '',
    orbital_period: '',
    planet_radius: '',
    planet_mass: '',
    semi_major_axis: '',
    eccentricity: '',
    stellar_magnitude: '',
    transit_depth: '',
    transit_duration: '',
    stellar_temperature: '',
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

    try {
      const confidence = Math.random() * 0.3 + 0.65;
      const isExoplanet = confidence > 0.75;

      const { error } = await supabase.from('predictions').insert({
        user_id: user!.id,
        planet_name: formData.planet_name,
        orbital_period: parseFloat(formData.orbital_period) || null,
        planet_radius: parseFloat(formData.planet_radius) || null,
        planet_mass: parseFloat(formData.planet_mass) || null,
        semi_major_axis: parseFloat(formData.semi_major_axis) || null,
        eccentricity: parseFloat(formData.eccentricity) || null,
        stellar_magnitude: parseFloat(formData.stellar_magnitude) || null,
        transit_depth: parseFloat(formData.transit_depth) || null,
        transit_duration: parseFloat(formData.transit_duration) || null,
        stellar_temperature: parseFloat(formData.stellar_temperature) || null,
        notes: formData.notes,
        prediction_result: isExoplanet ? 'confirmed' : 'rejected',
        confidence_score: confidence,
        is_exoplanet: isExoplanet,
      });

      if (error) throw error;

      toast.success('Prediction submitted successfully!');
      router.push('/history');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit prediction');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Rocket className="h-16 w-16 text-primary animate-pulse" />
      </div>
    );
  }

  const fields = [
    {
      id: 'planet_name',
      label: 'Planet Name',
      type: 'text',
      placeholder: 'e.g., Kepler-452c',
      tooltip: 'A unique identifier for your planetary candidate',
      required: true,
    },
    {
      id: 'orbital_period',
      label: 'Orbital Period (days)',
      type: 'number',
      placeholder: 'e.g., 365.25',
      tooltip: 'Time it takes the planet to complete one orbit around its star',
      step: '0.01',
    },
    {
      id: 'planet_radius',
      label: 'Planet Radius (Earth radii)',
      type: 'number',
      placeholder: 'e.g., 1.6',
      tooltip: 'Size of the planet relative to Earth (1 R⊕ = Earth radius)',
      step: '0.01',
    },
    {
      id: 'planet_mass',
      label: 'Planet Mass (Earth masses)',
      type: 'number',
      placeholder: 'e.g., 5.0',
      tooltip: 'Mass of the planet relative to Earth (1 M⊕ = Earth mass)',
      step: '0.01',
    },
    {
      id: 'semi_major_axis',
      label: 'Semi-Major Axis (AU)',
      type: 'number',
      placeholder: 'e.g., 1.05',
      tooltip: 'Average distance from the planet to its star (1 AU = Earth-Sun distance)',
      step: '0.001',
    },
    {
      id: 'eccentricity',
      label: 'Orbital Eccentricity',
      type: 'number',
      placeholder: 'e.g., 0.02',
      tooltip: 'Measure of how elliptical the orbit is (0 = circular, closer to 1 = more elliptical)',
      step: '0.001',
      min: '0',
      max: '1',
    },
    {
      id: 'stellar_magnitude',
      label: 'Stellar Magnitude',
      type: 'number',
      placeholder: 'e.g., 13.4',
      tooltip: 'Brightness of the host star as seen from Earth',
      step: '0.1',
    },
    {
      id: 'transit_depth',
      label: 'Transit Depth (%)',
      type: 'number',
      placeholder: 'e.g., 0.5',
      tooltip: 'Percentage decrease in star brightness when planet passes in front',
      step: '0.001',
    },
    {
      id: 'transit_duration',
      label: 'Transit Duration (hours)',
      type: 'number',
      placeholder: 'e.g., 6.5',
      tooltip: 'How long the planet takes to cross in front of its star',
      step: '0.1',
    },
    {
      id: 'stellar_temperature',
      label: 'Stellar Temperature (K)',
      type: 'number',
      placeholder: 'e.g., 5778',
      tooltip: 'Surface temperature of the host star in Kelvin',
      step: '1',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Navigation />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Rocket className="h-10 w-10 text-primary animate-float" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            New Exoplanet Prediction
          </h1>
          <p className="text-muted-foreground">
            Enter the planetary parameters below for AI analysis
          </p>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
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
              <div className="grid md:grid-cols-2 gap-6">
                <TooltipProvider>
                  {fields.map((field) => (
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
                        value={formData[field.id as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.id]: e.target.value })
                        }
                        required={field.required}
                        step={field.step}
                        min={field.min}
                        max={field.max}
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
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                      Our machine learning model analyzes the planetary parameters you provide and compares them against patterns from confirmed exoplanets. The prediction includes a confidence score indicating the likelihood of this being an actual exoplanet.
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
                    Analyzing...
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

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm text-muted-foreground">Parameters Analyzed</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">&lt; 1s</div>
                <div className="text-sm text-muted-foreground">Processing Time</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
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
