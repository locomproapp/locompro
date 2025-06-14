import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// Removed: import BuyRequestCard from '@/components/BuyRequestCard';
import { Button } from '@/components/ui/button';
import { Search, Package, Handshake, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
// Removed: import { useQuery } from '@tanstack/react-query';
// Removed: import { supabase } from '@/integrations/supabase/client';
import SearchBar from '@/components/SearchBar';

// Removed BuyRequest type and queries

const Index = () => {
  // Removed: useQuery for buyRequests

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            ¿Qué estás <span className="text-primary">buscando</span>?
          </h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            La plataforma donde los compradores publican qué buscan y los vendedores envían ofertas. 
            Encontrá exactamente lo que necesitás al mejor precio.
          </p>
          {/* SearchBar debajo del título y subtítulo */}
          <div className="mb-8 flex justify-center">
            <SearchBar />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/market">
                <Search className="mr-2 h-5 w-5" />
                Explorar Mercado
              </Link>
            </Button>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/create-buy-request">
                <Search className="mr-2 h-5 w-5" />
                ¿Qué Buscás?
              </Link>
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-8 mb-0">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Publicá el producto que buscás</h3>
            <p className="text-muted-foreground">
              Describí tu presupuesto, de dónde sos y qué características te interesan.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Recibí ofertas</h3>
            <p className="text-muted-foreground">
              La gente que tenga lo que buscás te lo va a ofrecer.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Elegí la mejor</h3>
            <p className="text-muted-foreground">
              Compará las ofertas y quedate con la que más te sirva.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
