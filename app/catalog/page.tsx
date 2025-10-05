'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase, Exoplanet } from '@/lib/supabase';
import { Search, Globe, Thermometer, Ruler, Calendar, MapPin, Sparkles, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CatalogPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [filteredExoplanets, setFilteredExoplanets] = useState<Exoplanet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [discoveryMethod, setDiscoveryMethod] = useState('all');
  const [habitableOnly, setHabitableOnly] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchExoplanets();
    }
  }, [user]);

  useEffect(() => {
    filterExoplanets();
  }, [searchQuery, discoveryMethod, habitableOnly, exoplanets]);

  const fetchExoplanets = async () => {
    try {
      const { data, error } = await supabase
        .from('exoplanets')
        .select('*')
        .order('discovery_year', { ascending: false });

      if (error) throw error;
      setExoplanets(data || []);
      setFilteredExoplanets(data || []);
    } catch (error) {
      console.error('Error fetching exoplanets:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const filterExoplanets = () => {
    let filtered = [...exoplanets];

    if (searchQuery) {
      filtered = filtered.filter(
        (planet) =>
          planet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          planet.host_star.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (discoveryMethod !== 'all') {
      filtered = filtered.filter((planet) => planet.discovery_method === discoveryMethod);
    }

    if (habitableOnly) {
      filtered = filtered.filter((planet) => planet.habitable_zone);
    }

    setFilteredExoplanets(filtered);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 animate-gradient-shift">
        <div className="relative">
          <Globe className="h-16 w-16 text-primary animate-bounce-in" />
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-glow-pulse" />
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full animate-morphing" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-3/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      </div>
    );
  }

  const discoveryMethods = Array.from(
    new Set(exoplanets.map((p) => p.discovery_method))
  );

  return (
    <div className="min-h-screen bg-transparent">
      {/* <Navigation /> */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 right-10 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
        <div className="absolute bottom-20 left-10 w-2 h-2 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center animate-slide-in-top">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-10 w-10 text-primary animate-float hover:animate-wobble cursor-pointer transition-all duration-300" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent animate-slide-in-blur neon-glow">
            Exoplanet Catalog
          </h1>
          <p className="text-muted-foreground animate-slide-in-bottom stagger-1">
            Explore confirmed exoplanets discovered across the galaxy
          </p>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl mb-8 hover-lift hover-glow transition-all duration-500 glass animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 animate-slide-in-left">
              <Filter className="h-5 w-5 animate-infinite-rotate" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2 animate-slide-in-left stagger-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-pulse" />
                  <Input
                    placeholder="Search by planet or star name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white focus-glow transition-all duration-300 hover:scale-105"
                  />
                </div>
              </div>

              <div className="animate-slide-in-bottom stagger-2">
                <Select value={discoveryMethod} onValueChange={setDiscoveryMethod}>
                  <SelectTrigger className="bg-white focus-glow transition-all duration-300 hover:scale-105">
                    <SelectValue placeholder="Discovery Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    {discoveryMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="animate-slide-in-right stagger-3">
                <Button
                  variant={habitableOnly ? 'default' : 'outline'}
                  onClick={() => setHabitableOnly(!habitableOnly)}
                  className="gap-2 hover-lift focus-glow transition-all duration-300 w-full"
                >
                  <Sparkles className={`h-4 w-4 ${habitableOnly ? 'animate-heartbeat' : ''}`} />
                  Habitable Zone
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground animate-slide-in-top stagger-4">
              <span>
                Showing <strong className="text-foreground animate-pulse">{filteredExoplanets.length}</strong> of{' '}
                <strong className="text-foreground animate-pulse">{exoplanets.length}</strong> exoplanets
              </span>
            </div>
          </CardContent>
        </Card>

        {loadingData ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white/60 rounded-lg animate-pulse hover-lift glass" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="p-6 space-y-4">
                  <div className="w-3/4 h-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded animate-shimmer" />
                  <div className="w-1/2 h-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded animate-shimmer" style={{ animationDelay: `${i * 50}ms` }} />
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-primary/10 rounded animate-shimmer" style={{ animationDelay: `${i * 75}ms` }} />
                    <div className="w-4/5 h-2 bg-accent/10 rounded animate-shimmer" style={{ animationDelay: `${i * 25}ms` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredExoplanets.length === 0 ? (
          <Card className="border-0 bg-white/60 backdrop-blur-sm glass animate-scale-in">
            <CardContent className="py-12 text-center">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50 animate-bounce-in" />
              <h3 className="text-xl font-semibold mb-2 animate-slide-in-top">No exoplanets found</h3>
              <p className="text-muted-foreground animate-slide-in-bottom">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in-bottom">
            {filteredExoplanets.map((planet, index) => (
              <Card
                key={planet.id}
                className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all hover-lift hover-glow cursor-pointer group glass animate-scale-in"
                onClick={() => setSelectedPlanet(planet)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 group-hover:animate-wobble">
                      {planet.name}
                    </CardTitle>
                    {planet.habitable_zone && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 animate-glow-pulse hover:animate-heartbeat">
                        <Sparkles className="h-3 w-3 mr-1 animate-infinite-rotate" />
                        Habitable
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1 group-hover:text-foreground transition-colors duration-300">
                    <Globe className="h-3 w-3 group-hover:animate-heartbeat" />
                    {planet.host_star}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                        <Calendar className="h-4 w-4 text-muted-foreground group-hover:animate-pulse" />
                        <span className="text-muted-foreground">Discovered:</span>
                      </div>
                      <span className="font-semibold group-hover:text-primary transition-colors duration-300">{planet.discovery_year}</span>

                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                        <MapPin className="h-4 w-4 text-muted-foreground group-hover:animate-bounce" />
                        <span className="text-muted-foreground">Distance:</span>
                      </div>
                      <span className="font-semibold group-hover:text-primary transition-colors duration-300">{planet.distance_from_earth?.toFixed(1)} ly</span>

                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                        <Ruler className="h-4 w-4 text-muted-foreground group-hover:animate-pulse" />
                        <span className="text-muted-foreground">Radius:</span>
                      </div>
                      <span className="font-semibold group-hover:text-primary transition-colors duration-300">{planet.planet_radius?.toFixed(2)} R⊕</span>

                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                        <Thermometer className="h-4 w-4 text-muted-foreground group-hover:animate-wiggle" />
                        <span className="text-muted-foreground">Temp:</span>
                      </div>
                      <span className="font-semibold group-hover:text-primary transition-colors duration-300">{planet.equilibrium_temperature?.toFixed(0)} K</span>
                    </div>

                    <div className="pt-3 border-t">
                      <Badge variant="outline" className="text-xs group-hover:bg-primary/10 group-hover:border-primary transition-all duration-300">
                        {planet.discovery_method}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedPlanet} onOpenChange={() => setSelectedPlanet(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass animate-scale-in">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2 animate-slide-in-left">
              {selectedPlanet?.name}
              {selectedPlanet?.habitable_zone && (
                <Badge className="bg-green-100 text-green-700 border-green-200 animate-glow-pulse">
                  <Sparkles className="h-3 w-3 mr-1 animate-infinite-rotate" />
                  Habitable Zone
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-base animate-slide-in-right">
              Orbiting {selectedPlanet?.host_star}
            </DialogDescription>
          </DialogHeader>

          {selectedPlanet && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-sm">{selectedPlanet.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Discovery Year</p>
                  <p className="font-semibold">{selectedPlanet.discovery_year}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Discovery Method</p>
                  <p className="font-semibold">{selectedPlanet.discovery_method}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Distance from Earth</p>
                  <p className="font-semibold">{selectedPlanet.distance_from_earth?.toFixed(1)} light years</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Orbital Period</p>
                  <p className="font-semibold">{selectedPlanet.orbital_period?.toFixed(2)} days</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Planet Radius</p>
                  <p className="font-semibold">{selectedPlanet.planet_radius?.toFixed(2)} R⊕</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Planet Mass</p>
                  <p className="font-semibold">{selectedPlanet.planet_mass?.toFixed(2)} M⊕</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Semi-Major Axis</p>
                  <p className="font-semibold">{selectedPlanet.semi_major_axis?.toFixed(3)} AU</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Eccentricity</p>
                  <p className="font-semibold">{selectedPlanet.eccentricity?.toFixed(3)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Equilibrium Temperature</p>
                  <p className="font-semibold">{selectedPlanet.equilibrium_temperature?.toFixed(0)} K</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Stellar Magnitude</p>
                  <p className="font-semibold">{selectedPlanet.stellar_magnitude?.toFixed(1)}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-100">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">R⊕</strong> = Earth radii • <strong className="text-foreground">M⊕</strong> = Earth masses • <strong className="text-foreground">AU</strong> = Astronomical Units • <strong className="text-foreground">K</strong> = Kelvin
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
