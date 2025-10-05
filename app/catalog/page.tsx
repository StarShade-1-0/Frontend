'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Database, 
  FileText, 
  TrendingUp, 
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Telescope
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Dataset {
  id: string;
  name: string;
  description: string;
  mission: string;
  size: string;
  records: string;
  features: number;
  endpoint: string;
  filename: string;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ReactNode;
  highlights: string[];
}

export default function DatasetsPage() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const datasets: Dataset[] = [
    {
      id: 'kepler',
      name: 'Kepler Mission Dataset',
      description: 'Original Kepler mission exoplanet candidates and confirmed planets with comprehensive stellar and planetary parameters.',
      mission: 'NASA Kepler',
      size: '~2.5 MB',
      records: '9,564',
      features: 50,
      endpoint: `${API_URL}/kepler/dataset`,
      filename: 'kepler_dataset.csv',
      badge: 'Most Popular',
      badgeVariant: 'default',
      icon: <Telescope className="h-6 w-6" />,
      highlights: [
        'Primary Kepler mission data (2009-2013)',
        'Confirmed exoplanets and candidates',
        'Stellar parameters (temperature, radius, mass)',
        'Orbital characteristics and transit data'
      ]
    },
    {
      id: 'k2',
      name: 'K2 Mission Dataset',
      description: 'Extended K2 mission data covering additional fields with diverse stellar populations and exoplanet discoveries.',
      mission: 'NASA K2',
      size: '~1.8 MB',
      records: '7,892',
      features: 50,
      endpoint: `${API_URL}/k2/dataset`,
      filename: 'k2_dataset.csv',
      badge: 'Extended Coverage',
      badgeVariant: 'secondary',
      icon: <Sparkles className="h-6 w-6" />,
      highlights: [
        'K2 extended mission data (2014-2018)',
        'Multiple campaign fields',
        'Broader sky coverage',
        'Unique stellar populations'
      ]
    },
    {
      id: 'merged',
      name: 'Merged Comprehensive Dataset',
      description: 'Combined Kepler and K2 mission data with unified schema, providing the most comprehensive exoplanet dataset for ML training.',
      mission: 'Combined',
      size: '~4.5 MB',
      records: '17,456',
      features: 50,
      endpoint: `${API_URL}/merged/dataset`,
      filename: 'merged_dataset.csv',
      badge: 'Recommended',
      badgeVariant: 'destructive',
      icon: <BarChart3 className="h-6 w-6" />,
      highlights: [
        'Complete Kepler + K2 combined data',
        'Standardized and normalized features',
        'Optimal for machine learning training',
        'Maximum sample diversity'
      ]
    }
  ];

  const handleDownload = async (dataset: Dataset) => {
    setDownloading(dataset.id);
    
    try {
      const response = await fetch(dataset.endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to download dataset: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = dataset.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Download Started!', {
        description: `${dataset.name} is being downloaded.`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download Failed', {
        description: 'Unable to download the dataset. Please try again.'
      });
    } finally {
      setDownloading(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-float" />
        </div>
        <Card className="max-w-md relative z-10">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access datasets</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-4 animate-slide-in-top">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Database className="h-10 w-10" />
            </div>
            <h1 className="text-5xl font-black">Datasets</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl animate-slide-in-bottom">
            Access our comprehensive collection of exoplanet datasets from NASA's Kepler and K2 missions. 
            Download high-quality data for research, analysis, and machine learning applications.
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8 mb-8 animate-slide-in-bottom relative z-10">
        <Alert className="bg-white border-blue-200 shadow-lg">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Dataset Information</AlertTitle>
          <AlertDescription className="text-blue-700">
            All datasets are in CSV format with standardized features including stellar parameters, 
            orbital characteristics, and classification labels. Perfect for training ML models.
          </AlertDescription>
        </Alert>
      </div>

      {/* Datasets Grid */}
      <div className="container mx-auto max-w-6xl px-4 pb-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset, index) => (
            <Card 
              key={dataset.id} 
              className="group hover-lift hover-glow transition-all duration-300 border-2 hover:border-primary/50 animate-scale-in bg-white/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:scale-110 transition-transform">
                    {dataset.icon}
                  </div>
                  <Badge variant={dataset.badgeVariant} className="animate-pulse">
                    {dataset.badge}
                  </Badge>
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  {dataset.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {dataset.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Dataset Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="font-semibold">{dataset.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Records</p>
                      <p className="font-semibold">{dataset.records}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2 font-semibold">Key Features:</p>
                  <ul className="space-y-1">
                    {dataset.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Badge variant="outline" className="font-mono">
                    {dataset.features} features
                  </Badge>
                  <Badge variant="outline">
                    {dataset.mission}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full group-hover:scale-105 transition-transform"
                  onClick={() => handleDownload(dataset)}
                  disabled={downloading === dataset.id}
                >
                  {downloading === dataset.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Dataset
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Usage Information */}
        <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-br from-white to-blue-50/50 animate-slide-in-bottom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Dataset Usage Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  What's Included
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>Stellar parameters (mass, radius, temperature)</li>
                  <li>Orbital characteristics (period, semi-major axis)</li>
                  <li>Transit parameters (depth, duration, epoch)</li>
                  <li>Classification labels (confirmed, candidate, false positive)</li>
                  <li>Signal-to-noise ratios and quality flags</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Recommended Use Cases
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>Machine learning model training and validation</li>
                  <li>Statistical analysis of exoplanet populations</li>
                  <li>Feature engineering and selection studies</li>
                  <li>Comparative analysis across missions</li>
                  <li>Educational and research projects</li>
                </ul>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Data Attribution</AlertTitle>
              <AlertDescription className="text-blue-700">
                These datasets are derived from NASA's Kepler and K2 missions. When using this data in publications 
                or research, please cite the original mission data and acknowledge the NASA Exoplanet Archive.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
