
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Search, Package, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import SearchBuyRequests from '@/components/SearchBuyRequests';

// Removed useQuery and BuyRequest since data is not displayed on homepage.

const Index = () => {
  // Lift query state to trigger search only on submit/click
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState('');

  // This handler will be passed to SearchBar
  const handleSearch = (query: string) => {
    setLastSubmittedQuery(query); // Only update when submitted
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          <h1
            className="text-4xl md:text-6xl font-medium tracking-tight text-foreground"
            style={{
              fontFamily: 'inherit', // explicitly matches Mercado's inheritance of the button font
              letterSpacing: '0em',   // match as per Mercado text
              fontWeight: 500,        // Mercado and header use font-medium
              color: 'inherit',       // ensure same color as default header
            }}
          >
            LoCompro
          </h1>
          {/* Increased margin below h1 for more breathing room */}
          <p className="text-xl text-muted-foreground mb-8 mt-7 max-w-3xl mx-auto">
            La plataforma donde los compradores publican qué buscan y los vendedores envían ofertas.
          </p>
          {/* Increased space below subtitle for balance */}
          <div className="mb-10 flex justify-center">
            <SearchBar 
              placeholder="Producto que quieras vender"
              onSearch={handleSearch}
            />
          </div>

          {/* Show filtered publications only if a search was made */}
          {lastSubmittedQuery && (
            <div className="mb-12 w-full max-w-3xl mx-auto">
              <SearchBuyRequests searchQuery={lastSubmittedQuery} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/market">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explorar Mercado
              </Link>
            </Button>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/create-buy-request">
                <Plus className="mr-2 h-5 w-5" />
                Crear Búsqueda
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-0">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Publicá el producto que buscás</h3>
            <p className="text-muted-foreground">
              Describí tu presupuesto, de dónde sos y qué características te interesan.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Recibí ofertas</h3>
            <p className="text-muted-foreground">
              La gente que tenga lo que buscás te lo va a ofrecer.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Elegí la mejor</h3>
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

