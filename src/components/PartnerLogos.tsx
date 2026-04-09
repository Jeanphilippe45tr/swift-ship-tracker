import React from 'react';

const partners = [
  { name: 'FedEx', color: '#4D148C' },
  { name: 'DHL', color: '#D40511' },
  { name: 'UPS', color: '#351C15' },
  { name: 'Maersk', color: '#42B0D5' },
  { name: 'TNT', color: '#FF6600' },
  { name: 'USPS', color: '#004B87' },
  { name: 'Aramex', color: '#E2231A' },
  { name: 'DB Schenker', color: '#EC0016' },
];

const PartnerLogos: React.FC = () => (
  <section className="py-12 bg-muted/50">
    <div className="container mx-auto px-4">
      <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">Trusted by leading logistics partners worldwide</p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {partners.map(p => (
          <div
            key={p.name}
            className="flex items-center justify-center px-6 py-3 rounded-lg bg-card shadow-sm border border-border hover:shadow-card transition-shadow"
          >
            <span className="font-bold text-lg tracking-tight" style={{ color: p.color }}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnerLogos;
