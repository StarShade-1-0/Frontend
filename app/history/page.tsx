'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase, Prediction } from '@/lib/supabase';
import { History, CircleCheck as CheckCircle2, Circle as XCircle, Clock, Trash2, Calendar, ChartBar as BarChart } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchPredictions();
    }
  }, [user]);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase.from('predictions').delete().eq('id', deleteId);

      if (error) throw error;

      setPredictions(predictions.filter((p) => p.id !== deleteId));
      toast.success('Prediction deleted successfully');
    } catch (error) {
      toast.error('Failed to delete prediction');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <History className="h-16 w-16 text-primary animate-pulse" />
      </div>
    );
  }

  const stats = {
    total: predictions.length,
    confirmed: predictions.filter((p) => p.is_exoplanet === true).length,
    pending: predictions.filter((p) => p.prediction_result === 'pending').length,
    rejected: predictions.filter((p) => p.is_exoplanet === false).length,
  };

  return (
    <div className="min-h-screen bg-transparent">
      

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <History className="h-10 w-10 text-primary animate-float" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r text-white bg-clip-text text-transparent">
            Prediction History
          </h1>
          <p className="text-muted-foreground text-white">
            Review all your exoplanet predictions and their results
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.confirmed}</div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">{stats.rejected}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              All Predictions
            </CardTitle>
            <CardDescription>Click on any prediction to view full details</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : predictions.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No predictions yet</h3>
                <p className="text-muted-foreground mb-4">Start by making your first prediction</p>
                <Button onClick={() => router.push('/predict')}>Make a Prediction</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="p-4 rounded-lg border bg-gradient-to-r from-white to-blue-50/30 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {prediction.planet_name || 'Unnamed Planet'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(prediction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {prediction.prediction_result === 'pending' ? (
                          <Badge variant="outline" className="bg-orange-50">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        ) : prediction.is_exoplanet ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Exoplanet
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      {prediction.planet_radius && (
                        <div>
                          <span className="text-muted-foreground">Radius: </span>
                          <span className="font-semibold">{prediction.planet_radius.toFixed(2)} R⊕</span>
                        </div>
                      )}
                      {prediction.planet_mass && (
                        <div>
                          <span className="text-muted-foreground">Mass: </span>
                          <span className="font-semibold">{prediction.planet_mass.toFixed(2)} M⊕</span>
                        </div>
                      )}
                      {prediction.orbital_period && (
                        <div>
                          <span className="text-muted-foreground">Period: </span>
                          <span className="font-semibold">{prediction.orbital_period.toFixed(2)} days</span>
                        </div>
                      )}
                      {prediction.confidence_score && (
                        <div>
                          <span className="text-muted-foreground">Confidence: </span>
                          <span className="font-semibold text-primary">
                            {(prediction.confidence_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedPrediction(prediction)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(prediction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedPrediction} onOpenChange={() => setSelectedPrediction(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedPrediction?.planet_name || 'Unnamed Planet'}
              {selectedPrediction?.prediction_result === 'pending' ? (
                <Badge variant="outline" className="bg-orange-50">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              ) : selectedPrediction?.is_exoplanet ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Confirmed Exoplanet
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not an Exoplanet
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Submitted on{' '}
              {selectedPrediction &&
                new Date(selectedPrediction.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedPrediction && (
            <div className="space-y-6">
              {selectedPrediction.confidence_score && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Prediction Confidence</span>
                    <span className="text-2xl font-bold text-primary">
                      {(selectedPrediction.confidence_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${selectedPrediction.confidence_score * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedPrediction.orbital_period && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Orbital Period</p>
                    <p className="font-semibold">{selectedPrediction.orbital_period.toFixed(2)} days</p>
                  </div>
                )}
                {selectedPrediction.planet_radius && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Planet Radius</p>
                    <p className="font-semibold">{selectedPrediction.planet_radius.toFixed(2)} R⊕</p>
                  </div>
                )}
                {selectedPrediction.planet_mass && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Planet Mass</p>
                    <p className="font-semibold">{selectedPrediction.planet_mass.toFixed(2)} M⊕</p>
                  </div>
                )}
                {selectedPrediction.semi_major_axis && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Semi-Major Axis</p>
                    <p className="font-semibold">{selectedPrediction.semi_major_axis.toFixed(3)} AU</p>
                  </div>
                )}
                {selectedPrediction.eccentricity && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Eccentricity</p>
                    <p className="font-semibold">{selectedPrediction.eccentricity.toFixed(3)}</p>
                  </div>
                )}
                {selectedPrediction.stellar_magnitude && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Stellar Magnitude</p>
                    <p className="font-semibold">{selectedPrediction.stellar_magnitude.toFixed(2)}</p>
                  </div>
                )}
                {selectedPrediction.transit_depth && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Transit Depth</p>
                    <p className="font-semibold">{selectedPrediction.transit_depth.toFixed(3)}%</p>
                  </div>
                )}
                {selectedPrediction.transit_duration && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Transit Duration</p>
                    <p className="font-semibold">{selectedPrediction.transit_duration.toFixed(2)} hours</p>
                  </div>
                )}
                {selectedPrediction.stellar_temperature && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Stellar Temperature</p>
                    <p className="font-semibold">{selectedPrediction.stellar_temperature.toFixed(0)} K</p>
                  </div>
                )}
              </div>

              {selectedPrediction.notes && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Notes</p>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm">{selectedPrediction.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prediction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this prediction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
