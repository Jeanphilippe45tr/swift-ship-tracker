import React from 'react';
import { Users, Award, Globe, Target } from 'lucide-react';

const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-muted/30 py-16">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-3">About FastTrackerPro</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Your trusted partner in global logistics since 2010</p>
      </div>

      <div className="prose prose-lg mx-auto mb-16 text-muted-foreground">
        <p className="text-foreground leading-relaxed">
          FastTrackerPro is a leading global logistics company providing innovative shipping and tracking solutions.
          We connect businesses and individuals worldwide with reliable, transparent, and efficient delivery services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {[
          { icon: Target, title: 'Our Mission', desc: 'To revolutionize global logistics with technology-driven solutions that make shipping faster, safer, and more transparent.' },
          { icon: Globe, title: 'Global Reach', desc: 'Operating in 200+ countries with a network of 10,000+ logistics partners and strategic warehouse locations.' },
          { icon: Users, title: 'Our Team', desc: 'A dedicated team of 5,000+ logistics professionals committed to delivering excellence in every shipment.' },
          { icon: Award, title: 'Recognition', desc: 'Award-winning logistics provider recognized for innovation, reliability, and customer satisfaction.' },
        ].map((item, i) => (
          <div key={i} className="flex gap-4 p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <item.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AboutPage;
