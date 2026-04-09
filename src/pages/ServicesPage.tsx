import React from 'react';
import { Truck, Globe, Package, Shield, Clock, Plane, Ship, Train } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  { icon: Truck, title: 'Express Delivery', desc: 'Same-day and next-day delivery services for time-critical shipments. Available in 50+ major cities worldwide.', color: 'text-secondary' },
  { icon: Plane, title: 'Air Freight', desc: 'Fast and reliable air cargo services for international shipments. Door-to-door and airport-to-airport options.', color: 'text-info' },
  { icon: Ship, title: 'Sea Freight', desc: 'Cost-effective ocean shipping for large volumes. FCL and LCL options with competitive transit times.', color: 'text-primary' },
  { icon: Train, title: 'Rail Freight', desc: 'Eco-friendly rail transport connecting major trade routes across continents.', color: 'text-success' },
  { icon: Package, title: 'Warehousing', desc: 'Strategic warehouse locations for storage, distribution, and fulfillment services.', color: 'text-warning' },
  { icon: Globe, title: 'Customs Brokerage', desc: 'Expert customs clearance services ensuring smooth cross-border shipments.', color: 'text-destructive' },
  { icon: Shield, title: 'Cargo Insurance', desc: 'Comprehensive insurance coverage for all types of shipments and cargo values.', color: 'text-primary' },
  { icon: Clock, title: 'Supply Chain', desc: 'End-to-end supply chain management and optimization solutions.', color: 'text-secondary' },
];

const ServicesPage: React.FC = () => (
  <div className="min-h-screen bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-3">Our Services</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive logistics solutions tailored to your business needs</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <Card key={i} className="hover:shadow-card transition-shadow group">
            <CardContent className="pt-6">
              <s.icon className={`w-10 h-10 ${s.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="font-semibold text-lg text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default ServicesPage;
