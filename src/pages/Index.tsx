
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import CreateBuyRequestDialog from '@/components/CreateBuyRequestDialog';
import BuyRequestCard from '@/components/BuyRequestCard';
import { useBuyRequests } from '@/hooks/useBuyRequests';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { buyRequests, loading, refetch } = useBuyRequests(searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-4 py-16">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Publicá qué buscás
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            LoCompro es el marketplace inverso. Decí qué querés comprar y recibí ofertas de vendedores.
          </p>
          <CreateBuyRequestDialog onRequestCreated={refetch} />
        </div>
        
        {/* Search section */}
        <div className="w-full max-w-4xl mb-16">
          <SearchBar onSearch={handleSearch} placeholder="Buscar solicitudes de compra..." />
        </div>
        
        {/* Quick categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mb-12">
          {[
            { name: 'Electrónicos', icon: '📱' },
            { name: 'Ropa', icon: '👕' },
            { name: 'Hogar', icon: '🏠' },
            { name: 'Autos', icon: '🚗' }
          ].map((category) => (
            <div 
              key={category.name}
              className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-border"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Results section */}
        {(searchQuery || buyRequests.length > 0) && (
          <div className="w-full max-w-6xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Solicitudes recientes'}
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Buscando...</p>
              </div>
            ) : buyRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buyRequests.map((request) => (
                  <BuyRequestCard key={request.id} buyRequest={request} showOfferButton={true} />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron resultados para "{searchQuery}"</p>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
