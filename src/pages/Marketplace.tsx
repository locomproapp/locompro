
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchBuyRequests from '@/components/SearchBuyRequests';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromURL = urlParams.get('search') || '';
    setSearchQuery(searchFromURL);
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Marketplace Heading & Main search bar */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mercado
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Acá se encuentran las publicaciones de los que quieren comprar un producto
          </p>
          {/* Search bar + button */}
          <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-3xl mx-auto gap-4 mt-8">
            <div className="flex-1 w-full">
              <SearchBar
                placeholder="¿Qué estás buscando?"
                onSearch={setSearchQuery}
                value={searchQuery}
              />
            </div>
            <Button asChild size="lg" className="flex items-center gap-2 w-full sm:w-auto whitespace-nowrap">
              <Link 
                to="/create-buy-request" 
                state={{ from: "/marketplace" }}
              >
                <Plus className="h-4 w-4" />
                Crear publicación
              </Link>
            </Button>
          </div>
        </div>

        {/* Resultados de búsqueda */}
        <div className="mt-6 mb-8 sm:mb-16">
          <SearchBuyRequests searchQuery={searchQuery} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
