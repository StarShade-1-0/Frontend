'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase, Prediction } from '@/lib/supabase';
import { Rocket, TrendingUp, Clock, CircleCheck as CheckCircle2, Circle as XCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    rejected: 0,
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setPredictions(data || []);

      const { data: allPredictions } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user!.id);

      if (allPredictions) {
        setStats({
          total: allPredictions.length,
          confirmed: allPredictions.filter((p) => p.is_exoplanet === true).length,
          pending: allPredictions.filter((p) => p.prediction_result === 'pending').length,
          rejected: allPredictions.filter((p) => p.is_exoplanet === false).length,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 animate-gradient-shift">
        <div className="relative">
          <Rocket className="h-16 w-16 text-primary animate-bounce-in" />
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-glow-pulse" />
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full animate-morphing" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-3/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 animate-slide-in-top">
          <h1 className="text-4xl font-bold mb-2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg inline-block shadow-lg">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back, {profile?.full_name || 'Explorer'}!
            </span>
          </h1>
          {/* <p className="text-lg font-medium bg-white/90 backdrop-blur-sm px-6 py-2 rounded-lg inline-block mt-3 shadow-md">
            Track your exoplanet discoveries and predictions
          </p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-in-bottom">
          <Card className="border-2 bg-white bg-white/80 shadow-2xl hover:shadow-3xl transition-all hover-lift hover-glow group" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors duration-300">Total Predictions</CardTitle>
              <Rocket className="h-4 w-4 text-muted-foreground group-hover:animate-float group-hover:text-primary transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary animate-elastic-in group-hover:animate-heartbeat">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">All-time submissions</p>
            </CardContent>
          </Card>

          <Card className="border-2 bg-white/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all hover-lift hover-glow group" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-green-600 transition-colors duration-300">Confirmed Exoplanets</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600 group-hover:animate-heartbeat transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 animate-elastic-in group-hover:animate-bounce-in">{stats.confirmed}</div>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">Positive predictions</p>
            </CardContent>
          </Card>

          <Card className="border-2 bg-white/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all hover-lift hover-glow group" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-orange-600 transition-colors duration-300">Pending Analysis</CardTitle>
              <Clock className="h-4 w-4 text-orange-600 group-hover:animate-infinite-rotate transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 animate-elastic-in group-hover:animate-pulse">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">Awaiting results</p>
            </CardContent>
          </Card>

          <Card className="border-2  bg-white/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all hover-lift hover-glow group" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-red-600 transition-colors duration-300">Non-Exoplanets</CardTitle>
              <XCircle className="h-4 w-4 text-red-600 group-hover:animate-wobble transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 animate-elastic-in group-hover:animate-wobble">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">Negative predictions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Predictions
                  </CardTitle>
                  <CardDescription>Your latest submissions</CardDescription>
                </div>
                <Link href="/history">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : predictions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No predictions yet</p>
                  <Link href="/predict">
                    <Button className="mt-4">Make Your First Prediction</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="p-4 rounded-lg border bg-gradient-to-r from-white to-blue-50/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{prediction.planet_name || 'Unnamed Planet'}</h3>
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
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>Model: {prediction.model_used === 'model1' ? 'K2 RF' : prediction.model_used === 'model2' ? 'Kepler VS' : 'Merged LR'}</div>
                        <div>Result: {prediction.prediction_result}</div>
                      </div>
                      {prediction.confidence_score !== null && prediction.confidence_score !== undefined && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Confidence: </span>
                          <span className="font-semibold text-primary">
                            {(prediction.confidence_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Jump to your most used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/predict">
                <Button className="w-full justify-start gap-2 h-auto py-4" size="lg">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">New Prediction</div>
                    <div className="text-xs opacity-80">Submit planet data for analysis</div>
                  </div>
                </Button>
              </Link>

              <Link href="/catalog">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-4 border-2"
                  size="lg"
                >
                  <div className="p-2 rounded-lg bg-blue-50">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Browse Catalog</div>
                    <div className="text-xs text-muted-foreground">Explore confirmed exoplanets</div>
                  </div>
                </Button>
              </Link>

              <Link href="/history">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-4 border-2"
                  size="lg"
                >
                  <div className="p-2 rounded-lg bg-orange-50">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">View History</div>
                    <div className="text-xs text-muted-foreground">See all your predictions</div>
                  </div>
                </Button>
              </Link>

              <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-orange-50 border border-blue-100">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Pro Tip:</strong> The more accurate your planetary parameters, the better the prediction results!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
