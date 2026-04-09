import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Menu, X, Shield, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdminLoggedIn, logoutAdmin } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/track', label: 'Track Package' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Fast<span className="text-secondary">Tracker</span>Pro</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAdminLoggedIn ? (
              <>
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Shield className="w-4 h-4" /> Dashboard
                  </Button>
                </Link>
                <Link to="/admin/chat">
                  <Button variant="outline" size="sm" className="gap-1">
                    <MessageSquare className="w-4 h-4" /> Chat
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logoutAdmin}>Logout</Button>
              </>
            ) : (
              <Link to="/admin/login">
                <Button size="sm" className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Shield className="w-4 h-4" /> Admin
                </Button>
              </Link>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border space-y-1">
              {isAdminLoggedIn ? (
                <>
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-muted-foreground">Dashboard</Link>
                  <button onClick={() => { logoutAdmin(); setMobileOpen(false); }} className="block px-3 py-2 text-sm font-medium text-muted-foreground">Logout</button>
                </>
              ) : (
                <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-muted-foreground">Admin Login</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
