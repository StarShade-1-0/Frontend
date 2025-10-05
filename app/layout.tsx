import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TerraFinder - AI-Powered Exoplanet Discovery',
  description: 'Discover new worlds with advanced machine learning. TerraFinder uses cutting-edge AI to identify and analyze exoplanets from astronomical data.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        {/* Background Image Container */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
            style={{ backgroundImage: "url('/bg.jpg')" }}
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/85 to-slate-950/90" /> */}
        </div>
        
        {/* App Content */}
        <div className="relative z-10 min-h-screen">
          <AuthProvider>
            <Navigation />
            <main className="bg-transparent">{children}</main>
            <Toaster />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
