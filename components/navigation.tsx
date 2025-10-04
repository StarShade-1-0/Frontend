'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Rocket, LayoutDashboard, Search, History, LogOut, User } from 'lucide-react';

export function Navigation() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/predict', label: 'New Prediction', icon: Rocket },
    { href: '/catalog', label: 'Exoplanet Catalog', icon: Search },
    { href: '/history', label: 'My History', icon: History },
  ];

  if (!user) return null;

  return (
    <nav className="border-b bg-white/50 backdrop-blur-lg sticky top-0 z-50 glass animate-slide-in-top">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group hover-lift">
            <div className="relative">
              <Rocket className="h-8 w-8 text-primary transition-transform group-hover:scale-110 animate-bounce" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-glow-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient-shift">
              ExoPlanet Discovery
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 animate-slide-in-right">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover-lift animate-slide-up delay-${(index + 1) * 100} ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="animate-slide-in-left">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-lift hover-glow focus-glow">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 animate-glow-pulse hover:animate-heartbeat transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white animate-gradient-shift">
                      {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass animate-scale-in">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1 animate-slide-in-top">
                    <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="animate-slide-in-left stagger-1">
                  <Link href="/profile" className="cursor-pointer hover-lift focus-glow transition-all duration-300">
                    <User className="mr-2 h-4 w-4 animate-pulse" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive hover:text-destructive animate-slide-in-left stagger-2 hover-lift focus-glow transition-all duration-300">
                  <LogOut className="mr-2 h-4 w-4 animate-wobble" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="md:hidden flex gap-1 mt-4 overflow-x-auto pb-2 animate-slide-in-bottom">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={`gap-2 whitespace-nowrap hover-lift focus-glow transition-all duration-300 group ${
                    isActive ? 'bg-primary text-primary-foreground animate-glow-pulse' : 'hover-glow'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 ${isActive ? 'animate-heartbeat' : 'group-hover:animate-bounce'}`} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
