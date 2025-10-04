'use client';

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Globe, TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName);
        toast.success('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setFormData({ email: formData.email, password: '', fullName: '' });
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Globe, TrendingUp, Zap, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const { user, loading, signIn, signUp } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName);
        toast.success('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setFormData({ email: formData.email, password: '', fullName: '' });
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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

  if (user) {
    return null;
  }

  const features = [
    {
      icon: Rocket,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning models analyze planetary data to identify potential exoplanets',
    },
    {
      icon: Globe,
      title: 'Comprehensive Catalog',
      description: 'Explore thousands of confirmed exoplanets with detailed scientific data',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Discoveries',
      description: 'Monitor your predictions and see how they compare with confirmed exoplanets',
    },
    {
      icon: Zap,
      title: 'Real-Time Analysis',
      description: 'Get instant feedback on your planetary parameter inputs',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 animate-gradient-shift">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float hover-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute top-10 right-20 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full animate-morphing" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-slide-in-top">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative animate-bounce-in">
              <Rocket className="h-16 w-16 text-primary animate-float hover:animate-wobble cursor-pointer transition-all duration-300" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-glow-pulse" />
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full animate-infinite-rotate opacity-50" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent animate-slide-in-blur neon-glow">
            ExoPlanet Discovery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in-bottom stagger-2">
            NASA Space Apps Challenge - Identify and analyze exoplanets using cutting-edge machine learning technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto mb-16">
          <div className="animate-slide-in-left">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover-lift hover-glow transition-all duration-500 glass">
              <CardHeader>
                <CardTitle className="text-2xl animate-scale-in">Get Started</CardTitle>
                <CardDescription className="animate-slide-in-bottom stagger-1">Sign in or create an account to begin your exoplanet journey</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(v) => setIsSignUp(v === 'signup')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signin">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2 animate-slide-in-left stagger-1">
                        <Label htmlFor="email" className="animate-fade-in">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="focus-glow transition-all duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2 animate-slide-in-left stagger-2">
                        <Label htmlFor="password" className="animate-fade-in">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          className="focus-glow transition-all duration-300 hover:scale-105"
                        />
                      </div>
                      <Button type="submit" className="w-full hover-lift focus-glow animate-slide-in-up stagger-3" disabled={submitting}>
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Signing in...
                          </span>
                        ) : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2 animate-slide-in-right stagger-1">
                        <Label htmlFor="fullName" className="animate-fade-in">Full Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                          className="focus-glow transition-all duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2 animate-slide-in-right stagger-2">
                        <Label htmlFor="signup-email" className="animate-fade-in">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="focus-glow transition-all duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2 animate-slide-in-right stagger-3">
                        <Label htmlFor="signup-password" className="animate-fade-in">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={6}
                          className="focus-glow transition-all duration-300 hover:scale-105"
                        />
                      </div>
                      <Button type="submit" className="w-full hover-lift focus-glow animate-slide-in-up stagger-4" disabled={submitting}>
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Creating account...
                          </span>
                        ) : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 animate-slide-in-right">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all hover:shadow-xl hover-lift hover-glow duration-500 animate-scale-in glass group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent hover:animate-heartbeat transition-all duration-300 group-hover:scale-110 animate-glow-pulse">
                        <Icon className="h-6 w-6 text-white transition-transform duration-300 hover:rotate-12" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="text-center py-12 border-t border-border/50 animate-slide-in-bottom">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-5 w-5 text-orange-500 animate-heartbeat" />
            <span className="text-sm text-muted-foreground animate-typewriter">NASA Space Apps Challenge 2024</span>
            <Star className="h-5 w-5 text-orange-500 animate-heartbeat" />
          </div>
          <p className="text-xs text-muted-foreground animate-slide-in-top stagger-3">
            Powered by advanced machine learning and comprehensive exoplanet data
          </p>
        </div>
      </div>
    </div>
  );
}
