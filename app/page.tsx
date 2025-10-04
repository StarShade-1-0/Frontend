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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="text-center">
          <Rocket className="h-16 w-16 text-primary animate-bounce mx-auto mb-4" />
          <p className="text-gray-600 animate-pulse-glow">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Globe,
      title: 'Explore Exoplanets',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Simple floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute top-10 right-20 w-4 h-4 bg-primary/30 rounded-full animate-bounce" />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-orange-400/40 rounded-full animate-bounce delay-200" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-float">
              <Rocket className="h-16 w-16 text-primary hover-scale cursor-pointer transition-transform duration-300" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent">
            ExoPlanet Discovery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up delay-200">
            NASA Space Apps Challenge - Identify and analyze exoplanets using cutting-edge machine learning technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Form */}
          <div className="order-2 lg:order-1">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover-lift transition-all duration-300 glass">
              <CardHeader>
                <CardTitle className="text-2xl animate-slide-up">Get Started</CardTitle>
                <CardDescription className="animate-slide-up delay-100">Sign in or create an account to begin your exoplanet journey</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(v) => setIsSignUp(v === 'signup')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signin">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2 animate-slide-up delay-100">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="focus-glow transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2 animate-slide-up delay-200">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="focus-glow transition-all duration-300"
                        />
                      </div>
                      <Button type="submit" className="w-full hover-lift animate-slide-up delay-300" disabled={submitting}>
                        {submitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Signing in...
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2 animate-slide-up delay-100">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                          className="focus-glow transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2 animate-slide-up delay-200">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="focus-glow transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2 animate-slide-up delay-300">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="focus-glow transition-all duration-300"
                        />
                      </div>
                      <Button type="submit" className="w-full hover-lift animate-slide-up delay-400" disabled={submitting}>
                        {submitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating account...
                          </div>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Features */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="animate-slide-up delay-300">
              <h2 className="text-3xl font-bold mb-6">Start Your Journey</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of space enthusiasts in discovering and analyzing exoplanets using our advanced tools and NASA data.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 rounded-lg bg-white/50 hover-lift transition-all duration-300 animate-slide-up delay-${(index + 4) * 100}`}
                >
                  <div className="flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-12 animate-slide-up">By the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "5,000+", label: "Confirmed Planets" },
              { number: "3,000+", label: "Planet Candidates" },
              { number: "4,000+", label: "Stars with Planets" },
              { number: "700+", label: "Multi-Planet Systems" }
            ].map((stat, index) => (
              <div key={index} className={`animate-slide-up delay-${(index + 1) * 100}`}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-pulse-glow">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}