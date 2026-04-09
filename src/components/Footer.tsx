import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="font-bold text-lg">FastTrackerPro</span>
          </div>
          <p className="text-sm opacity-80">Your trusted partner in global logistics and package delivery. Fast, reliable, and transparent shipping solutions.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm opacity-80">
            <Link to="/track" className="block hover:opacity-100 transition-opacity">Track Package</Link>
            <Link to="/services" className="block hover:opacity-100 transition-opacity">Services</Link>
            <Link to="/about" className="block hover:opacity-100 transition-opacity">About Us</Link>
            <Link to="/contact" className="block hover:opacity-100 transition-opacity">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <div className="space-y-2 text-sm opacity-80">
            <p>Express Delivery</p>
            <p>Freight Shipping</p>
            <p>Warehousing</p>
            <p>Last Mile Delivery</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact Info</h4>
          <div className="space-y-3 text-sm opacity-80">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@fasttrackerp.com</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (800) 555-FAST</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Logistics Ave, NY 10001</div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-60">
        © {new Date().getFullYear()} FastTrackerPro. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
