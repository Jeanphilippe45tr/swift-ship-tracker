import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ContactPage: React.FC = () => (
  <div className="min-h-screen bg-muted/30 py-16">
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-3">Contact Us</h1>
        <p className="text-muted-foreground">Get in touch with our logistics experts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {[
            { icon: Mail, title: 'Email', info: 'support@fasttrackerp.com' },
            { icon: Phone, title: 'Phone', info: '+1 (800) 555-FAST' },
            { icon: MapPin, title: 'Address', info: '123 Logistics Avenue, New York, NY 10001' },
            { icon: Clock, title: 'Hours', info: 'Mon-Fri: 8AM-8PM EST • 24/7 Tracking' },
          ].map((c, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <c.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.info}</p>
              </div>
            </div>
          ))}
        </div>
        <Card className="shadow-card">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-foreground">Name</label><Input placeholder="Your name" className="mt-1" /></div>
              <div><label className="text-sm font-medium text-foreground">Email</label><Input type="email" placeholder="Your email" className="mt-1" /></div>
            </div>
            <div><label className="text-sm font-medium text-foreground">Subject</label><Input placeholder="How can we help?" className="mt-1" /></div>
            <div><label className="text-sm font-medium text-foreground">Message</label><Textarea placeholder="Your message..." rows={4} className="mt-1" /></div>
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Send Message</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default ContactPage;
