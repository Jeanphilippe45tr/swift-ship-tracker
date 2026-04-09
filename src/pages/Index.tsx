import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Truck, Globe, Clock, Shield, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PartnerLogos from '@/components/PartnerLogos';
import { useApp } from '@/context/AppContext';

const Index: React.FC = () => {
  const [tracking, setTracking] = useState('');
  const navigate = useNavigate();
  const { getShipmentByTracking } = useApp();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (tracking.trim()) {
      navigate(`/track?id=${encodeURIComponent(tracking.trim())}`);
    }
  };

  const features = [
    { icon: Truck, title: 'Express Delivery', desc: 'Same-day and next-day delivery options for urgent shipments worldwide.' },
    { icon: Globe, title: 'Global Coverage', desc: 'Ship to 200+ countries with our extensive network of logistics partners.' },
    { icon: Clock, title: 'Real-Time Tracking', desc: 'Monitor your packages live on the map with accurate ETA predictions.' },
    { icon: Shield, title: 'Secure Shipping', desc: 'End-to-end insurance and secure handling for all package types.' },
    { icon: Package, title: 'Warehousing', desc: 'Strategic warehouse locations for efficient storage and distribution.' },
    { icon: MapPin, title: 'Last Mile', desc: 'Reliable last-mile delivery ensuring packages reach your doorstep.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground mb-6 text-sm font-medium border border-secondary/30">
              <Package className="w-4 h-4" /> Trusted by 50,000+ businesses globally
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Ship Faster. <br />Track <span className="text-secondary">Smarter.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              FastTrackerPro delivers end-to-end logistics solutions with real-time tracking, global coverage, and unmatched reliability.
            </p>

            <form onSubmit={handleTrack} className="max-w-xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={tracking}
                  onChange={e => setTracking(e.target.value)}
                  placeholder="Enter tracking number (e.g. FTP-DEMO1234)"
                  className="pl-10 h-12 bg-card text-foreground border-0 shadow-lg"
                />
              </div>
              <Button type="submit" className="h-12 px-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                Track <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <PartnerLogos />

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Why Choose FastTrackerPro?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive logistics solutions designed for modern businesses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '200+', label: 'Countries Served' },
              { value: '50K+', label: 'Active Clients' },
              { value: '99.8%', label: 'On-Time Delivery' },
              { value: '24/7', label: 'Customer Support' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-gradient">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="gradient-primary rounded-2xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Ship?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Get started with FastTrackerPro today and experience the future of logistics.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/contact')} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 font-semibold">
                Get Started
              </Button>
              <Button variant="outline" onClick={() => navigate('/track')} className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Track a Package
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
