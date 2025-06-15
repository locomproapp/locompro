
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchBuyRequests from '@/components/SearchBuyRequests';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del marketplace */}
        <div className="mb-8 text-center">
          {/* Mini Navigation Links (Inicio and Mercado) */}
          <div className="flex justify-center items-center gap-4 mb-3">
            <Link to="/" className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Inicio
            </Link>
            <span className="text-lg font-semibold text-foreground">Mercado</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mercado
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Acá se encuentran las publicaciones de los que quieren comprar un producto
          </p>
          {/* Search bar + button */}
          <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-3xl mx-auto gap-4 mt-8">
            <div className="flex-1 w-full">
              <SearchBar placeholder="¿Qué estás buscando?" />
            </div>
            <Button asChild size="lg" className="flex items-center gap-2 w-full sm:w-auto whitespace-nowrap">
              <Link to="/create-buy-request">
                <Plus className="h-4 w-4" />
                Crear publicación
              </Link>
            </Button>
          </div>
        </div>

        {/* Resultados de búsqueda */}
        <div className="mt-6">
          <SearchBuyRequests />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
