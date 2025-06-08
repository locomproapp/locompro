
import React from 'react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  return (
    <nav className="w-full bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">LoCompro</h1>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex space-x-4">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Inicio
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Mercado
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Login / Register
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
